import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PayLoadType } from 'src/auth/payload.type';
import { UserInteractionService } from './user-interaction.service';
@UseGuards(AuthGuard)
@Controller('user-interaction')
export class UserInteractionController {
  constructor(
    private readonly userInteractionService: UserInteractionService,
  ) {}

  @Post('createInteraction')
  async createInteraction(
    @Request() req: { user: PayLoadType },
    @Body()
    body: {
      productId: string;
      isLike: boolean;
      comment: string;
    },
  ) {
    return this.userInteractionService.createInteraction({
      userId: req.user.userid,
      ...body,
    });
  }
}
