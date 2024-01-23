import { Controller, Get } from '@nestjs/common';
import { ImportDataService } from './import-data.service';

@Controller('import-data')
export class ImportDataController {
  constructor(private readonly importDataService: ImportDataService) {}

  @Get('ImportShop')
  async ImportShop() {
    await this.importDataService.ImportShop();
    return 'xxx';
  }
  @Get('ImportProdList')
  async ImportProdList() {
    return this.importDataService.ImportProdList();
  }

  @Get('generateUserList')
  async generateUserList() {
    return this.importDataService.generateUserList();
  }

  @Get('generateDishList')
  async generateDishList() {
    return this.importDataService.generateDishList();
  }
}
