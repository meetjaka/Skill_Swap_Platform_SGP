import db from "../db/client.js";
const prisma = db;
import { NotFound, ForbiddenError } from "../errors/generic.errors.js";

/**
 * Shared helper: verify a user belongs to a swap class.
 * Returns the swapClass record if authorized, otherwise throws.
 */
export const assertUserInClass = async (userId, classId) => {
  const swapClass = await prisma.swapClass.findUnique({
    where: { id: classId },
  });

  if (!swapClass) throw new NotFound("Class not found");

  const swapRequest = await prisma.swapRequest.findUnique({
    where: { id: swapClass.swapRequestId },
  });
  if (!swapRequest) throw new NotFound("Swap request not found");

  const isMember = [swapRequest.fromUserId, swapRequest.toUserId].some(
    (memberId) => String(memberId) === String(userId),
  );
  if (!isMember) throw new ForbiddenError("Not authorized");

  const classData = swapClass.toObject ? swapClass.toObject() : swapClass;
  return { ...classData, swapRequest };
};
