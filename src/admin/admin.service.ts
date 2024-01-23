import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ShopSettleService } from 'src/shop-settle/shop-settle.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly PrismaService: PrismaService,
    private readonly ShopSettleService: ShopSettleService,
  ) {}

  async ReViewProduct(ProuctId: string, isApprove: boolean) {
    return this.PrismaService.productsShelves.update({
      where: {
        id: ProuctId,
      },
      data: {
        allowShopControl: isApprove,
        isShelvesShow: false,
      },
    });
  }
}
