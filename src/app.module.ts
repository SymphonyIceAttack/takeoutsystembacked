import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { ImportDataModule } from './import-data/import-data.module';
import { ShopProductListModule } from './shop-product-list/shop-product-list.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ShopModule } from './shop/shop.module';
import { AdminModule } from './admin/admin.module';
import { RecommendModule } from './recommend/recommend.module';
import { ShopSettleModule } from './shop-settle/shop-settle.module';
import { UserInteractionModule } from './user-interaction/user-interaction.module';
import { DataAnalysisModule } from './data-analysis/data-analysis.module';

@Module({
  imports: [
    UsersModule,
    ImportDataModule,
    ShopProductListModule,
    AuthModule,
    OrderModule,
    ShopModule,
    AdminModule,
    RecommendModule,
    ShopSettleModule,
    UserInteractionModule,
    DataAnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
