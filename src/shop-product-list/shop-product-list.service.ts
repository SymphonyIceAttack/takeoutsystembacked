import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShopProductListService {
  constructor(private readonly PrismaService: PrismaService) {}

  async MerchantArray() {
    return await this.PrismaService.shop.findMany();
  }
  async ProdList(
    pageNumber: number,
    AreaId?: string,
    mer_id?: string,
    allowControl?: boolean,
    isShelvesShow?: boolean,
  ) {
    const pageSize = 10; // 每页记录数
    const skip = (pageNumber - 1) * pageSize; // 计算要跳过的记录数量
    const take = pageSize; // 返回的记录数量

    const totalCount = await this.PrismaService.productsShelves.count({
      where: {
        area_id: AreaId,
        mer_id: mer_id,
        allowShopControl: allowControl,
        isShelvesShow: isShelvesShow,
      },
    });

    const list = await this.PrismaService.productsShelves.findMany({
      where: {
        area_id: AreaId,
        mer_id: mer_id,
        allowShopControl: allowControl,
        isShelvesShow: isShelvesShow,
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
}
