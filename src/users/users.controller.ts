import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PayLoadType } from 'src/auth/payload.type';
import { userIdentityEnum } from './userIdentity.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('SignUp')
  SignUp(
    @Body()
    UserMessage: {
      account: string;
      password: string;
      identity: userIdentityEnum;
    },
  ) {
    return this.usersService.SignUp(
      UserMessage.account,
      UserMessage.password,
      UserMessage.identity,
    );
  }

  @Post('Login')
  async Login(
    @Body()
    UserMessage: {
      account: string;
      password: string;
    },
  ) {
    return this.usersService.Login(UserMessage.account, UserMessage.password);
  }
  @UseGuards(AuthGuard)
  @Get('checkLogin')
  async checkLogin(@Request() req: { user: PayLoadType }) {
    return {
      statusCode: 201,
      user: req.user,
    };
  }
}
