import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserInteractionService {
  constructor(private readonly PrismaService: PrismaService) {}

  async createInteraction({
    userId,
    productId,
    isLike,
    comment,
  }: {
    userId: string;
    productId: string;
    isLike: boolean;
    comment: string;
  }) {
    return this.PrismaService.userInteraction.create({
      data: {
        userId,
        productId,
        isLike,
        comment,
      },
    });
  }
}
