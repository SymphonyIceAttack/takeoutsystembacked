import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { ImportDataModule } from './import-data/import-data.module';
import { ShopProductListModule } from './shop-product-list/shop-product-list.module';

@Module({
  imports: [UsersModule, ImportDataModule, ShopProductListModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
