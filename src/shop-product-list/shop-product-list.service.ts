import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShopProductListService {
  constructor(private readonly PrismaService: PrismaService) {}

  async MerchantArray() {
    return await this.PrismaService.shop.findMany();
  }
  async ProdList(AreaId: string | null, mer_id: string | null) {
    const whereCondition: any = {};

    if (AreaId !== null) {
      whereCondition.area_id = AreaId;
    }

    if (mer_id !== null) {
      whereCondition.mer_id = mer_id;
    }

    return this.PrismaService.productsShelves.findMany({
      where: whereCondition,
    });
  }
}
