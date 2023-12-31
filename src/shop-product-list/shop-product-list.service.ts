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
    AreaId: string | null,
    mer_id: string | null,
  ) {
    const pageSize = 10; // 每页记录数
    const skip = (pageNumber - 1) * pageSize; // 计算要跳过的记录数量
    const take = pageSize; // 返回的记录数量
    const whereCondition: any = {};

    if (AreaId !== null) {
      whereCondition.area_id = AreaId;
    }

    if (mer_id !== null) {
      whereCondition.mer_id = mer_id;
    }

    const totalCount = await this.PrismaService.productsShelves.count({
      where: whereCondition,
    });

    return {
      total: totalCount,
      list: await this.PrismaService.productsShelves.findMany({
        where: whereCondition,
        skip: skip, // 跳过的记录数量
        take: take, // 返回的记录数量
      }),
    };
  }
}
