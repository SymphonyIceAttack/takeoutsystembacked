import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PayLoadType } from 'src/auth/payload.type';
import { OrderService } from './order.service';

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
      ...{ user_id: req.user.userid },
    });
  }
}
