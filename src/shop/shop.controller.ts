import {
  Controller,
  Get,
  Param,
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

  @Get('getMerId')
  async getMerId(@Request() req: { user: PayLoadType }) {
    return this.shopService.getMerId(req.user.userid);
  }

  @Get('getShopDetail/:MerId')
  async getShopDetail(@Param('MerId') MerId: string) {
    return this.shopService.getShopDetail(MerId);
  }

  @Post('MerOrderList')
  async MerOrderList(
    @Query('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Request() req: { user: PayLoadType },
  ) {
    const mer_id = await this.shopService.getMerId(req.user.userid);
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

  @Post('MerProductList')
  async MerProductList(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Request() req: { user: PayLoadType },
  ) {
    const mer_id = await this.shopService.getMerId(req.user.userid);
    return this.shopService.MerProductList(pageNumber, mer_id);
  }
}
