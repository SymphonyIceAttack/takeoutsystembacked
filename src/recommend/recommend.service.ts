import { Injectable, Post } from '@nestjs/common';
import { getRandomObjects } from 'src/import-data/dateUtils';
import { OrderStatus } from 'src/order/Status.type';
import { PrismaService } from 'src/prisma.service';
import { cosineSimilarity, findSimilarUsers } from './SimilarityFunction';

@Injectable()
export class RecommendService {
  constructor(private readonly PrismaService: PrismaService) {}

  async userRecommend(UserId: string) {
    //查询该用户的order列表
    const UserOrders = await this.PrismaService.order.findMany({
      where: { user_id: UserId },
      include: {
        dishes: true,
      },
      orderBy: {
        create_time: 'desc',
      },
      take: 10,
    });

    const SetUserProductArray = new Set<string>();
    UserOrders.forEach((item) => {
      item.dishes.forEach((dish) => {
        SetUserProductArray.add(dish.productId);
      });
    });
    //根据这个商品id数组去查询相关用户列表
    const UserProductIds: string[] = Array.from(SetUserProductArray).slice(
      0,
      10,
    );

    //先查询这些商品包含的Dish
    const ProductList = await Promise.all(
      UserProductIds.map((productid) =>
        this.PrismaService.productsShelves.findUnique({
          where: { id: productid },
          include: {
            Dish: true,
          },
        }),
      ),
    );
    //通过每个Product上的Dish数组去查询order列表

    const SetOhterOrderArray = new Set<string>();
    ProductList.forEach((product) => {
      product.Dish.forEach((dish) => {
        SetOhterOrderArray.add(dish.order_id);
      });
    });
    const OhtherOrderIds = Array.from(SetOhterOrderArray);

    const SetUserArray = new Set<string>();

    const OhtherOrders = await Promise.all(
      OhtherOrderIds.map((orderId) =>
        this.PrismaService.order.findUnique({
          where: { id: orderId },
        }),
      ),
    );
    OhtherOrders.forEach((order) => {
      SetUserArray.add(order.user_id);
    });
    const UserIds = Array.from(SetUserArray);

    // .filter(
    //   (userId) => userId !== UserId,
    // );

    //通过UserIds查找所有的订单中的dish上的productId

    const otherUserProductList = await Promise.all(
      UserIds.map((userId) =>
        this.PrismaService.order.findMany({
          where: { user_id: userId },
          include: {
            dishes: true,
          },
        }),
      ),
    );

    //构建User与Product的交互矩阵
    const OtherUserProductMap: {
      [userId in string]: {
        [ProductId in string]: number;
      };
    } = {};

    otherUserProductList.forEach((otherUserProducts) => {
      otherUserProducts.forEach((order) => {
        order.dishes.forEach((dish) => {
          if (!OtherUserProductMap[order.user_id]) {
            OtherUserProductMap[order.user_id] = {};
          }
          if (!OtherUserProductMap[order.user_id][dish.productId]) {
            OtherUserProductMap[order.user_id][dish.productId] = 1;
          } else {
            OtherUserProductMap[order.user_id][dish.productId] += 1;
          }
        });
      });
    });

    // 获取所有产品的集合
    // const allProducts: Set<string> = new Set();
    // Object.values(OtherUserProductMap).forEach((user) => {
    //   Object.keys(user).forEach((productId) => {
    //     allProducts.add(productId);
    //   });
    // });

    // // 补齐缺失的产品为 0
    // Object.keys(OtherUserProductMap).forEach((userId) => {
    //   allProducts.forEach((productId) => {
    //     if (!(productId in OtherUserProductMap[userId])) {
    //       OtherUserProductMap[userId][productId] = 0;
    //     }
    //   });
    // });

    const targetUserId = UserId;
    const recommendations = await this.hybridRecommendation(
      targetUserId,
      OtherUserProductMap,
    );

    return Promise.all(
      recommendations.map(async (recommendItem) => {
        const ProductItem = await this.PrismaService.productsShelves.findUnique(
          {
            where: { id: recommendItem.productId },
          },
        );
        return {
          ...ProductItem,
          score: recommendItem.score.toFixed(2),
        };
      }),
    );
  }

  async recommendProductsWithScore(
    targetUserId: string,
    data: { [userId: string]: { [productId: string]: number } },
  ) {
    const targetUser = data[targetUserId];
    const similarUsers = findSimilarUsers(targetUserId, data);

    const weightedScores: { productId: string; score: number }[] = [];

    for (const userId of similarUsers) {
      const similarUser = data[userId];
      for (const productId in similarUser) {
        if (
          !targetUser.hasOwnProperty(productId) ||
          targetUser[productId] === 0
        ) {
          // Calculate weighted score based on similarity and user's rating
          const similarity = cosineSimilarity(targetUser, similarUser);
          const weightedScore = similarity * similarUser[productId];

          // Accumulate weighted scores in the array
          weightedScores.push({ productId, score: weightedScore });
        }
      }
    }

    return weightedScores;
  }

  async recommendPopularProducts(): Promise<
    { productId: string; score: number }[]
  > {
    const AllProductList = await this.PrismaService.productsShelves
      .findMany({
        include: { Dish: true },
      })
      .then((res) => {
        return res
          .map((item) => ({
            productId: item.id,
            score: item.Dish.length,
          }))
          .sort((a, b) => b.score - a.score);
      });
    return AllProductList.slice(0, 9);
  }
  async hybridRecommendation(
    userId: string,
    data: {
      [userId in string]: {
        [ProductId in string]: number;
      };
    },
  ) {
    // 根据用户交互次数或历史数据量判断当前阶段
    const interactionThreshold = 10; // 举例，可以根据实际情况调整
    const OrderList = await this.PrismaService.order.findMany({
      where: {
        user_id: userId,
      },
    });

    if (OrderList.length === 0) {
      return this.recommendPopularProducts();
    }

    const userInteractionCount = Object.keys(data[userId]).length;

    if (userInteractionCount < interactionThreshold) {
      // 当用户交互不足时，采用热门物品推荐
      return this.recommendPopularProducts();
    } else {
      // 当用户交互足够时，采用基于用户的协同过滤算法
      return this.recommendProductsWithScore(userId, data).then(
        (res) =>
          res
            .sort((a, b) => b.score - a.score)
            .filter((item) => item.score > 0)
            .slice(0, 9), // 根据推荐分数排序
      );
    }
  }
}
