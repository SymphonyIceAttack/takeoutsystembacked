import { Module } from '@nestjs/common';
import { ShopProductListService } from './shop-product-list.service';
import { ShopProductListController } from './shop-product-list.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ShopProductListController],
  providers: [ShopProductListService, PrismaService],
})
export class ShopProductListModule {}
