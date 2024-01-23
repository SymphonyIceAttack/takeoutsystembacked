import { Controller } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';

@Controller('user-interaction')
export class UserInteractionController {
  constructor(
    private readonly userInteractionService: UserInteractionService,
  ) {}
}
