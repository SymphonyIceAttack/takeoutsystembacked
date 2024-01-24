import { Injectable } from '@nestjs/common';
import { Dish } from '@prisma/client';
import {
  getFormattedDate,
  transformPreviousAndNextDay,
} from 'src/import-data/dateUtils';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DataAnalysisService {
  constructor(private readonly PrismaService: PrismaService) {}
  async analyzeSales() {
    const productList = await this.PrismaService.productsShelves
      .findMany({
        include: { Dish: true },
      })
      .then((res) => res.filter((item) => item.Dish.length > 0));

    const todayFormatted = getFormattedDate();
    const dateArray: string[] = [];
    Array.from({ length: 120 }).forEach((item, index) => {
      dateArray.push(
        transformPreviousAndNextDay(todayFormatted, index).previousDay,
      );
    });

    const resultsArray: { sold_total_last_at: number; sum: number }[] = [];

    for (const dateString of dateArray) {
      const DayProducts = productList.map((item) => ({
        ...item,
        Dish: item.Dish.filter((dish) => dish.create_time === dateString),
      }));
      const DayDish: Dish[] = [];

      for (const DayProduct of DayProducts) {
        for (const Dish of DayProduct.Dish) {
          DayDish.push(Dish);
        }
      }

      resultsArray.push({
        sold_total_last_at: parseInt(dateString),
        sum: DayDish.reduce((prevalue, Dish) => prevalue + 1, 0),
      });
    }

    return resultsArray.sort(
      (a, b) => a.sold_total_last_at - b.sold_total_last_at,
    );
  }
}
