import db from "../db/client.js";
const prisma = db;

export const getCommunityStatsService = async () => {
  const [learners, swaps, skills] = await Promise.all([
    prisma.users.count(),
    prisma.swapRequest.count(),
    prisma.skill.count(),
  ]);

  return { learners, swaps, skills };
};
