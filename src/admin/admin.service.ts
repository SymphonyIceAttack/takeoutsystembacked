import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly PrismaService: PrismaService) {}

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
