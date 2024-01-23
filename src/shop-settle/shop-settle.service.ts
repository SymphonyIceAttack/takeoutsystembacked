import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { userIdentityEnum } from 'src/users/userIdentity.enum';
import { UsersService } from 'src/users/users.service';
import { SettleStatusEnum } from './SettleStatus.enum';

@Injectable()
export class ShopSettleService {
  constructor(
    private readonly PrismaService: PrismaService,
    private readonly UsersService: UsersService,
  ) {}
  async createShopSettle(body: {
    account: string;
    password: string;
    store_title: string;
    area_id: string;
    area_title: string;
  }) {
    await this.UsersService.SignUp(
      body.account,
      body.password,
      userIdentityEnum.商家,
    );
    return this.PrismaService.shopSettle.create({
      data: {
        account: body.account,
        password: body.password,
        store_title: body.store_title,
        area_id: body.area_id,
        area_title: body.area_title,
        status: SettleStatusEnum.pending,
      },
    });
  }

  async ShopSettleList(pageNumber: number, status: SettleStatusEnum) {
    const pageSize = 10; // 每页记录数
    const skip = (pageNumber - 1) * pageSize; // 计算要跳过的记录数量
    const take = pageSize; // 返回的记录数量

    const totalCount = await this.PrismaService.shopSettle.count({
      where: {
        status: status,
      },
    });
    const list = await this.PrismaService.shopSettle.findMany({
      where: {
        status: status,
      },
      skip: skip, // 跳过的记录数量
      take: take, // 返回的记录数量
    });

    return {
      total: totalCount,
      list: list,
    };
  }
  async CheckShop(account: string, status: SettleStatusEnum) {
    const shopSettle = await this.PrismaService.shopSettle.findUnique({
      where: { account: account },
    });

    const user = await this.PrismaService.user.findUnique({
      where: { account },
    });

    if (status === SettleStatusEnum.Finish) {
      await this.PrismaService.shopSettle.update({
        where: { account },
        data: {
          status: SettleStatusEnum.Finish,
        },
      });
      return this.PrismaService.shop.create({
        data: {
          userId: user.id,
          store_title: shopSettle.store_title,
          area_id: shopSettle.area_id,
          area_title: shopSettle.area_title,
        },
      });
    }
    if (status === SettleStatusEnum.pending) {
      await this.PrismaService.shopSettle.update({
        where: { account },
        data: {
          status: SettleStatusEnum.pending,
        },
      });
      return this.PrismaService.shop.delete({
        where: {
          userId: user.id,
        },
      });
    }
  }
}
