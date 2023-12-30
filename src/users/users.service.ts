import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { userIdentityEnum } from './userIdentity.enum';

@Injectable()
export class UsersService {
  constructor(private readonly PrismaService: PrismaService) {}

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
    const user = await this.PrismaService.user.findUnique({
      where: {
        account,
      },
    });

    if (!user) {
      return {
        result: false,
      };
    }

    if (user.password === password) {
      return {
        result: true,
      };
    } else {
      return {
        result: false,
      };
    }
  }
}
