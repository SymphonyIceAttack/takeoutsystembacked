import {
  Controller,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PayLoadType } from 'src/auth/payload.type';
import { AdminService } from './admin.service';
@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('ReViewProduct')
  ReViewProduct(
    @Request() req: { user: PayLoadType },
    @Query('ProuctId') ProuctId: string,
    @Query('isApprove', ParseIntPipe) isApprove: number,
  ) {
    return this.adminService.ReViewProduct(ProuctId, isApprove === 1);
  }
}
