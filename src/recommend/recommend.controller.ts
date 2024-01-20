import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PayLoadType } from 'src/auth/payload.type';
import { RecommendService } from './recommend.service';
@UseGuards(AuthGuard)
@Controller('recommend')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}
  @Post('userRecommend')
  userRecommend(@Request() req: { user: PayLoadType }) {
    return this.recommendService.userRecommend(req.user.userid);
  }
}
