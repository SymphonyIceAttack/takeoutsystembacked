import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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
    const newOrder = await this.PrismaService.order.create({
      data: { mer_id: mer_id, user_id: user_id },
    });
    const DishPromiseArray: Promise<any>[] = [];

    Dishes.forEach((DishObj) => {
      new Array(DishObj.number).fill(0).forEach(() => {
        DishPromiseArray.push(
          this.PrismaService.dish.create({
            data: {
              productId: DishObj.product_id,
              order_id: newOrder.id,
            },
          }),
        );
      });
    });
    const res = await Promise.all(DishPromiseArray);

    return res;
  }
}
