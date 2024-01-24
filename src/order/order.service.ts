import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderStatus } from './Status.type';
import { Dish, ProductsShelves } from '@prisma/client';
import { getFormattedDate } from 'src/import-data/dateUtils';
@Injectable()
export class OrderService {
  constructor(private readonly PrismaService: PrismaService) {}

  async CreateOrder({
    mer_id,
    user_id,
    Dishes,
  }: {
    mer_id: string;
    user_id: string;
    Dishes: {
      product_id: string;
      number: number;
    }[];
  }) {
    const todayFormatted = getFormattedDate();
    const newOrder = await this.PrismaService.order.create({
      data: {
        mer_id: mer_id,
        user_id: user_id,
        number: 0,
        totalPrice: 0,
        status: OrderStatus.pending,
        create_time: todayFormatted,
      },
    });
    const DishPromiseArray: Promise<Dish & { product: ProductsShelves }>[] = [];

    Dishes.forEach((DishObj) => {
      new Array(DishObj.number).fill(0).forEach(() => {
        DishPromiseArray.push(
          this.PrismaService.dish.create({
            data: {
              productId: DishObj.product_id,
              order_id: newOrder.id,
              create_time: getFormattedDate(),
            },
            include: {
              product: true,
            },
          }),
        );
      });
    });

    for (const DishObj of Dishes) {
      await this.PrismaService.productsShelves.update({
        where: { id: DishObj.product_id },
        data: {
          sold_total_all: {
            increment: DishObj.number,
          },
        },
      });
    }

    const resDish = await Promise.all(DishPromiseArray);

    const TotalNumber = resDish.length;

    await this.PrismaService.order.update({
      where: {
        id: newOrder.id,
      },
      data: {
        number: TotalNumber,
        totalPrice: resDish.reduce((preTotalValue, item) => {
          return preTotalValue + item.product.goods_price_sale;
        }, 0),
      },
    });

    return resDish;
  }

  async OrderList(userId: string, pageNumber: number, status?: OrderStatus) {
    const pageSize = 10; // 每页记录数
    const skip = (pageNumber - 1) * pageSize; // 计算要跳过的记录数量
    const take = pageSize; // 返回的记录数量

    const totalCount = await this.PrismaService.order.count({
      where: {
        user_id: userId,
        status: status === OrderStatus.all ? undefined : status,
      },
    });

    return {
      total: totalCount,
      list: await this.PrismaService.order.findMany({
        where: {
          status: status === OrderStatus.all ? undefined : status,
          user_id: userId,
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

  async OrderDetailList(Orderid: string) {
    return this.PrismaService.dish.findMany({
      where: { order_id: Orderid },
      include: {
        product: true,
      },
    });
  }
}
