import { Module } from '@nestjs/common';
import { ImportDataService } from './import-data.service';
import { ImportDataController } from './import-data.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ImportDataController],
  providers: [ImportDataService, PrismaService],
})
export class ImportDataModule {}
