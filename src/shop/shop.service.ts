import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OrderStatus } from 'src/order/Status.type';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShopService {
  constructor(private readonly PrismaService: PrismaService) {}
  async getMerId(userId: string) {
    return this.PrismaService.user
      .findUnique({
        where: { id: userId },
        include: { Shop: true },
      })
      .then((res) => res.Shop.id)
      .catch(() => {
        throw new UnauthorizedException();
      });
  }

  async getShopDetail(MerId: string) {
    return this.PrismaService.shop.findUnique({
      where: { id: MerId },
    });
  }

  async MerOrderList(pageNumber: number, merId?: string, status?: OrderStatus) {
    const pageSize = 10; // 每页记录数
    const skip = (pageNumber - 1) * pageSize; // 计算要跳过的记录数量
    const take = pageSize; // 返回的记录数量

    const totalCount = await this.PrismaService.order.count({
      where: {
        mer_id: merId,
        status: status === OrderStatus.all ? undefined : status,
      },
    });

    return {
      total: totalCount,
      list: await this.PrismaService.order.findMany({
        where: {
          status: status === OrderStatus.all ? undefined : status,
          mer_id: merId,
        },
        include: {
          shop: true,
        },
        skip: skip, // 跳过的记录数量
        take: take, // 返回的记录数量
        orderBy: {
          create_time: 'desc',
        },
      }),
    };
  }
  async OrderReceived(OrderId: string) {
    return this.PrismaService.order.update({
      data: {
        status: OrderStatus.OrderReceived,
      },
      where: {
        id: OrderId,
      },
    });
  }
  async OrderFinish(OrderId: string) {
    return this.PrismaService.order.update({
      data: {
        status: OrderStatus.Finish,
      },
      where: {
        id: OrderId,
      },
    });
  }

  async MerProductList(pageNumber: number, isReview: boolean, merId?: string) {
    const pageSize = 10; // 每页记录数
    const skip = (pageNumber - 1) * pageSize; // 计算要跳过的记录数量
    const take = pageSize; // 返回的记录数量

    const totalCount = await this.PrismaService.productsShelves.count({
      where: {
        mer_id: merId,
        allowShopControl: isReview,
      },
    });

    const list = await this.PrismaService.productsShelves.findMany({
      where: {
        mer_id: merId,
        allowShopControl: isReview,
      },
      include: {
        Dish: true,
        UserInteraction: {
          select: {
            id: true,
            isLike: true,
          },
        },
      },
      skip: skip, // 跳过的记录数量
      take: take, // 返回的记录数量
    });

    return {
      total: totalCount,
      list: list.map((item) => ({
        ...item,
        countLike: item.UserInteraction.reduce((prevalue, userInter) => {
          const count = userInter.isLike ? 1 : -1;
          return prevalue + count;
        }, 0),
      })),
    };
  }

  async createProduct(
    MerId: string,
    ProdItem: { goods_price_sale: number; goods_title: string },
  ) {
    const shopItem = await this.getShopDetail(MerId);
    return this.PrismaService.productsShelves.create({
      data: {
        mer_id: MerId,
        store_title: shopItem.store_title,
        area_id: shopItem.area_id,
        AreaTitle: shopItem.area_title,
        goods_price_sale: ProdItem.goods_price_sale,
        goods_title: ProdItem.goods_title,
        sold_total_all: 0,
        allowShopControl: false,
        isShelvesShow: false,
      },
    });
  }

  async changeProductStatus(
    MerId: string,
    productId: string,
    isShelvesShow: boolean,
  ) {
    const OriginProduct = await this.PrismaService.productsShelves.findUnique({
      where: { id: productId },
      include: {
        shop: true,
      },
    });

    if (
      OriginProduct.shop.id !== MerId ||
      OriginProduct.allowShopControl === false
    ) {
      throw new UnauthorizedException();
    }
    return this.PrismaService.productsShelves.update({
      where: { id: productId },
      data: {
        isShelvesShow: isShelvesShow,
      },
    });
  }
}
