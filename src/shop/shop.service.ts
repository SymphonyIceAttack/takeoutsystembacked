import { Injectable } from '@nestjs/common';
import { OrderStatus } from 'src/order/Status.type';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShopService {
  constructor(private readonly PrismaService: PrismaService) {}

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
}
