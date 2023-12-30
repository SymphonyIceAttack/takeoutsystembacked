import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
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
}
