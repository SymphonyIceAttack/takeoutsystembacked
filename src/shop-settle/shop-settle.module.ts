import { Module } from '@nestjs/common';
import { ShopSettleService } from './shop-settle.service';
import { ShopSettleController } from './shop-settle.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ShopSettleController],
  providers: [ShopSettleService, PrismaService],
  exports: [ShopSettleService],
})
export class ShopSettleModule {}
