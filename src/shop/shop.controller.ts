import {
  Controller,
  Get,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PayLoadType } from 'src/auth/payload.type';
import { OrderStatus } from 'src/order/Status.type';
import { PrismaService } from 'src/prisma.service';
import { ShopService } from './shop.service';
@UseGuards(AuthGuard)
@Controller('shop')
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly PrismaService: PrismaService,
  ) {}

  @Post('MerOrderList')
  async MerOrderList(
    @Query('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Request() req: { user: PayLoadType },
  ) {
    const mer_id = await this.PrismaService.user
      .findUnique({
        where: { id: req.user.userid },
        include: { Shop: true },
      })
      .then((res) => res.Shop.id)
      .catch(() => undefined);
    return this.shopService.MerOrderList(pageNumber, mer_id, status);
  }
  @Post('OrderReceived')
  async OrderReceived(@Query('OrderId') OrderId: string) {
    if (!OrderId) return;
    return this.shopService.OrderReceived(OrderId);
  }
  @Post('OrderFinish')
  async OrderFinish(@Query('OrderId') OrderId: string) {
    if (!OrderId) return;
    return this.shopService.OrderFinish(OrderId);
  }
}
