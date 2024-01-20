import { Injectable, Post } from '@nestjs/common';
import { OrderStatus } from 'src/order/Status.type';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RecommendService {
  constructor(private readonly PrismaService: PrismaService) {}

  async userRecommend(UserId: string) {
    //查询该用户的order列表
    const UserOrders = await this.PrismaService.order.findMany({
      where: { user_id: UserId, status: OrderStatus.Finish },
      include: {
        dishes: true,
      },
    });

    const SetUserProductArray = new Set<string>();
    UserOrders.forEach((item) => {
      item.dishes.forEach((dish) => {
        SetUserProductArray.add(dish.productId);
      });
    });
    //根据这个商品id数组去查询相关用户列表
    const UserProductIds: string[] = Array.from(SetUserProductArray);
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
          where: { user_id: userId, status: OrderStatus.Finish },
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
    const allProducts: Set<string> = new Set();
    Object.values(OtherUserProductMap).forEach((user) => {
      Object.keys(user).forEach((productId) => {
        allProducts.add(productId);
      });
    });

    // 补齐缺失的产品为 0
    Object.keys(OtherUserProductMap).forEach((userId) => {
      allProducts.forEach((productId) => {
        if (!(productId in OtherUserProductMap[userId])) {
          OtherUserProductMap[userId][productId] = 0;
        }
      });
    });

    function cosineSimilarity(
      user1: { [productId: string]: number },
      user2: { [productId: string]: number },
    ): number {
      let dotProduct = 0;
      let normUser1 = 0;
      let normUser2 = 0;

      for (const productId in user1) {
        if (user2.hasOwnProperty(productId)) {
          dotProduct += user1[productId] * user2[productId];
        }
        normUser1 += user1[productId] ** 2;
      }

      for (const productId in user2) {
        normUser2 += user2[productId] ** 2;
      }

      const similarity =
        dotProduct / (Math.sqrt(normUser1) * Math.sqrt(normUser2));
      return isNaN(similarity) ? 0 : similarity; // Handle division by zero
    }

    function findSimilarUsers(
      targetUserId: string,
      data: { [userId: string]: { [productId: string]: number } },
    ): string[] {
      const targetUser = data[targetUserId];
      const similarUsers: string[] = [];

      for (const userId in data) {
        if (userId !== targetUserId) {
          const similarity = cosineSimilarity(targetUser, data[userId]);

          if (similarity > 0) {
            similarUsers.push(userId);
          }
        }
      }

      return similarUsers;
    }

    function recommendProductsWithScore(
      targetUserId: string,
      data: { [userId: string]: { [productId: string]: number } },
    ): { productId: string; score: number }[] {
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

    const targetUserId = UserId;
    const recommendations = recommendProductsWithScore(
      targetUserId,
      OtherUserProductMap,
    );

    return recommendations
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0);
  }
}
