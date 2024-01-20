export function cosineSimilarity(
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

  const similarity = dotProduct / (Math.sqrt(normUser1) * Math.sqrt(normUser2));
  return isNaN(similarity) ? 0 : similarity; // Handle division by zero
}

export function findSimilarUsers(
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
