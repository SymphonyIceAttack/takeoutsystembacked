import { Module } from '@nestjs/common';
import { DataAnalysisService } from './data-analysis.service';
import { DataAnalysisController } from './data-analysis.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DataAnalysisController],
  providers: [DataAnalysisService, PrismaService],
})
export class DataAnalysisModule {}
