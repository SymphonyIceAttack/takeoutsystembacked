import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma.service';
import { ShopSettleModule } from 'src/shop-settle/shop-settle.module';

@Module({
  imports: [ShopSettleModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
