import { Body, Controller, Get, Post } from '@nestjs/common';
import { ShopProductListService } from './shop-product-list.service';

@Controller('shop-product-list')
export class ShopProductListController {
  constructor(
    private readonly shopProductListService: ShopProductListService,
  ) {}

  @Get('MerchantArray')
  async MerchantArray() {
    return this.shopProductListService.MerchantArray();
  }

  @Post('ProdList')
  async ProdList(
    @Body() Filter: { MerChantId: string | null; AreaId: string | null },
  ) {
    console.log(Filter);

    return this.shopProductListService.ProdList(
      Filter.AreaId,
      Filter.MerChantId,
    );
  }
}
