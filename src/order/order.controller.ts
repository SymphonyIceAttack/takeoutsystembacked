import {
  Body,
  Controller,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PayLoadType } from 'src/auth/payload.type';
import { OrderService } from './order.service';
import { OrderStatus } from './Status.type';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('CreateOrder')
  async CreateOrder(
    @Body()
    body: {
      mer_id: string;
      Dishes: {
        product_id: string;
        number: number;
      }[];
    },
    @Request() req: { user: PayLoadType },
  ) {
    return this.orderService.CreateOrder({
      ...body,
      user_id: req.user.userid,
    });
  }
  @Post('OrderList')
  async OrderList(
    @Query('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Request() req: { user: PayLoadType },
  ) {
    return this.orderService.OrderList(req.user.userid, pageNumber, status);
  }
  @Post('OrderDetailList')
  async OrderDetailList(@Query('orderId') orderId: string) {
    return this.orderService.OrderDetailList(orderId);
  }
}
