import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OrderStatus } from 'src/order/Status.type';

import { PrismaService } from 'src/prisma.service';
import { SettleStatusEnum } from 'src/shop-settle/SettleStatus.enum';
import { userIdentityEnum } from 'src/users/userIdentity.enum';
import {
  getFormattedDate,
  getRandomObjects,
  transformPreviousAndNextDay,
} from './dateUtils';

@Injectable()
export class ImportDataService {
  constructor(private readonly PrismaService: PrismaService) {}

  async ImportShop() {
    return fetch('http://127.0.0.1:3001/data-analysis/exportShopList')
      .then((res) => res.json())
      .then(
        async (
          res: {
            mer_id: string;
            store_title: string;
            AreaTitle: string;
            area_id: string;
          }[],
        ) => {
          const UserList = await Promise.all(
            res.map((item) =>
              this.PrismaService.user.create({
                data: {
                  account: item.mer_id,
                  password: item.mer_id,
                  identity: userIdentityEnum.商家,
                  Shop: {
                    create: {
                      id: item.mer_id,
                      store_title: item.store_title,
                      area_id: item.area_id,
                      area_title: item.AreaTitle,
                    },
                  },
                },
              }),
            ),
          );
          await Promise.all(
            res.map((item) =>
              this.PrismaService.shopSettle.create({
                data: {
                  account: item.mer_id,
                  password: item.mer_id,
                  store_title: item.store_title,
                  area_id: item.area_id,
                  area_title: item.AreaTitle,
                  status: SettleStatusEnum.Finish,
                },
              }),
            ),
          );
          return UserList;
        },
      );
  }

  async ImportProdList() {
    return fetch('http://127.0.0.1:3001/data-analysis/itemSumSold')
      .then((res) => res.json())
      .then(
        (
          res: {
            id: number;
            area_id: string;
            mer_id: string;
            AreaTitle: string;
            goods_title: string;
            goods_price_sale: number;
            store_title: string;
            sold_total_all: number;
          }[],
        ) => {
          return Promise.all(
            res.map(async (item) =>
              this.PrismaService.productsShelves.create({
                data: {
                  id: item.id + '',
                  mer_id: item.mer_id,
                  goods_price_sale: item.goods_price_sale,
                  goods_title: item.goods_title,
                  area_id: item.area_id,
                  AreaTitle: item.AreaTitle,
                  sold_total_all: item.sold_total_all,
                  store_title: item.store_title,
                  allowShopControl: true,
                  isShelvesShow: true,
                },
              }),
            ),
          );
        },
      );
  }

  async generateUserList() {
    for (const item of Array.from({ length: 1000 })) {
      await this.PrismaService.user.create({
        data: {
          account: randomUUID(),
          password: '123456',
          identity: userIdentityEnum.学生,
        },
      });
    }
    return { ok: 'ok' };
  }

  async generateDishList() {
    const todayFormatted = getFormattedDate();
    const dateArray: string[] = [];
    Array.from({ length: 90 }).forEach((item, index) => {
      dateArray.push(
        transformPreviousAndNextDay(todayFormatted, index).previousDay,
      );
    });

    const users = await this.PrismaService.user.findMany();

    const Mers = await (
      await this.PrismaService.shop.findMany({
        include: { ProdList: true },
      })
    ).filter((item) => item.ProdList.length > 0);

    const Products = await this.PrismaService.productsShelves.findMany();

    for (const DateString of dateArray) {
      const orders = await Promise.all(
        getRandomObjects(users, Math.round(users.length / 2)).map((user) =>
          this.PrismaService.order.create({
            data: {
              user_id: user.id,
              mer_id: getRandomObjects(Mers, 1)[0].id,
              status: OrderStatus.Finish,
              number: 0,
              totalPrice: 0,
            },
          }),
        ),
      );
      for (const order of orders) {
        const resDish = await Promise.all(
          Array.from({ length: Math.floor(Math.random() * 3) }).map(() =>
            this.PrismaService.dish.create({
              data: {
                order_id: order.id,
                create_time: DateString,
                productId: getRandomObjects(
                  Products.filter((item) => item.mer_id === order.mer_id),
                  1,
                )[0].id,
              },
              include: {
                product: true,
              },
            }),
          ),
        );

        const TotalNumber = resDish.length;

        await this.PrismaService.order.update({
          where: {
            id: order.id,
          },
          data: {
            number: TotalNumber,
            totalPrice: resDish.reduce((preTotalValue, item) => {
              return preTotalValue + item.product.goods_price_sale;
            }, 0),
          },
        });
      }
    }

    //

    return { ok: 'ok' };
  }
}
