import {
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
import { SettleStatusEnum } from 'src/shop-settle/SettleStatus.enum';
import { ShopSettleService } from 'src/shop-settle/shop-settle.service';
import { AdminService } from './admin.service';
@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly ShopSettleService: ShopSettleService,
  ) {}

  @Post('ReViewProduct')
  ReViewProduct(
    @Request() req: { user: PayLoadType },
    @Query('ProuctId') ProuctId: string,
    @Query('isApprove', ParseIntPipe) isApprove: number,
  ) {
    return this.adminService.ReViewProduct(ProuctId, isApprove === 1);
  }

  @Post('ShopSettleList')
  ShopSettleList(
    @Query('status', new ParseEnumPipe(SettleStatusEnum))
    status: SettleStatusEnum,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
  ) {
    return this.ShopSettleService.ShopSettleList(pageNumber, status);
  }
  @Post('CheckShop')
  CheckShop(
    @Query('status', new ParseEnumPipe(SettleStatusEnum))
    status: SettleStatusEnum,
    @Query('account') account: string,
  ) {
    return this.ShopSettleService.CheckShop(account, status);
  }
}
