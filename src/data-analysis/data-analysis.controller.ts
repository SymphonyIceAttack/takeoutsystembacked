import { Controller, Get } from '@nestjs/common';
import { DataAnalysisService } from './data-analysis.service';

@Controller('data-analysis')
export class DataAnalysisController {
  constructor(private readonly dataAnalysisService: DataAnalysisService) {}
  @Get('analyzeSales')
  async analyzeSales() {
    return this.dataAnalysisService.analyzeSales();
  }
}
