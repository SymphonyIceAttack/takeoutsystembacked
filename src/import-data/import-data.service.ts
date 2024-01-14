import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { userIdentityEnum } from 'src/users/userIdentity.enum';

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
                },
              }),
            ),
          );
        },
      );
  }
}
