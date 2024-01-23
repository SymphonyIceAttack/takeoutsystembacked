import { Body, Controller, Post } from '@nestjs/common';
import { ShopSettleService } from './shop-settle.service';

@Controller('shop-settle')
export class ShopSettleController {
  constructor(private readonly shopSettleService: ShopSettleService) {}

  @Post('createShopSettle')
  createShopSettle(
    @Body()
    body: {
      account: string;
      password: string;
      store_title: string;
      area_id: string;
      area_title: string;
    },
  ) {
    return this.shopSettleService.createShopSettle(body);
  }
}
