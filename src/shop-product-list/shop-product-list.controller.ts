import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
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
    @Body()
    Filter: { MerChantId?: string; AreaId?: string },
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
  ) {
    return this.shopProductListService.ProdList(
      pageNumber,
      Filter.AreaId,
      Filter.MerChantId,
    );
  }
}
