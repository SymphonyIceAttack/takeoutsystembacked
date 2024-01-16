import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PayLoadType } from './payload.type';
import { userIdentityEnum } from 'src/users/userIdentity.enum';
@Injectable()
export class AuthService {
  constructor(
    private readonly PrismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signIn(account: string, pass: string) {
    const user = await this.PrismaService.user.findUnique({
      where: {
        account,
      },
    });
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload: PayLoadType = {
      userid: user.id,
      username: user.account,
      identity: user.identity as userIdentityEnum,
    };
    return {
      statusCode: 201,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
