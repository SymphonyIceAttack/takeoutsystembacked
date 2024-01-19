import {
  Body,
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

  @Get('getShopDetail')
  async getShopDetail(@Request() req: { user: PayLoadType }) {
    return this.shopService
      .getMerId(req.user.userid)
      .then((MerId) => MerId && this.shopService.getShopDetail(MerId));
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
    @Query('isReview', ParseIntPipe) isReview: number,
    @Request() req: { user: PayLoadType },
  ) {
    const mer_id = await this.shopService.getMerId(req.user.userid);
    return this.shopService.MerProductList(pageNumber, isReview === 1, mer_id);
  }
  @Post('createProduct')
  async createProduct(
    @Request() req: { user: PayLoadType },
    @Body() body: { goods_price_sale: number; goods_title: string },
  ) {
    return this.shopService
      .getMerId(req.user.userid)
      .then((MerId) => MerId && this.shopService.createProduct(MerId, body));
  }

  @Post('changeProductStatus')
  async changeProductStatus(
    @Request() req: { user: PayLoadType },
    @Query('isShelvesShow', ParseIntPipe) isShelvesShow: number,
    @Query('productId') productId: string,
  ) {
    return this.shopService
      .getMerId(req.user.userid)
      .then(
        (MerId) =>
          MerId &&
          this.shopService.changeProductStatus(
            MerId,
            productId,
            isShelvesShow === 1,
          ),
      );
  }
}
