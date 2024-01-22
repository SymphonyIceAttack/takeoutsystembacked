import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { userIdentityEnum } from './userIdentity.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly PrismaService: PrismaService,
    private readonly AuthService: AuthService,
  ) {}

  async SignUp(account: string, password: string, identity: userIdentityEnum) {
    return this.PrismaService.user.create({
      data: {
        account,
        password,
        identity,
      },
    });
  }
  async Login(account: string, password: string) {
    return this.AuthService.signIn(account, password);
  }

}
