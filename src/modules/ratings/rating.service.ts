import AppError from "../../utils/AppError.js";
import {
  findRatingByUserAndTarget,
  findRatingById,
  createRating,
  updateRating,
  deleteRating,
  findRatingsByTarget,
  countRatingsByTarget,
  getRatingDistribution,
  updateTargetRatingStats,
} from "./rating.repository.js";
import { ratingTargetRepository } from "./rating-target.repository.js";
import type {
  CreateRatingInput,
  UpdateRatingInput,
  RatingSummary,
} from "./rating.types.js";
import type { RatableType } from "@prisma/client";

const assertTargetExists = async (
  targetType: RatableType,
  targetId: string
) => {
  const exists = await ratingTargetRepository.exists(targetType, targetId);
  if (!exists) {
    throw new AppError(`${targetType} not found`, 404);
  }
};

export const createRatingService = async (
  userId: string,
  data: CreateRatingInput
) => {
  try {
    await assertTargetExists(data.targetType, data.targetId);

    const existing = await findRatingByUserAndTarget(
      userId,
      data.targetType,
      data.targetId
    );

    if (existing) {
      throw new AppError("You already rated this content", 409);
    }

    const rating = await createRating({
      userId,
      targetType: data.targetType,
      targetId: data.targetId,
      score: data.score,
      comment: data.comment,
    });

    await updateTargetRatingStats(data.targetType, data.targetId);

    return rating;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const updateRatingService = async (
  userId: string,
  ratingId: string,
  data: UpdateRatingInput
) => {
  try {
    const rating = await findRatingById(ratingId);

    if (!rating) throw new AppError("Rating not found", 404);
    if (rating.userId !== userId) {
      throw new AppError("You can only edit your own ratings", 403);
    }

    const updated = await updateRating(ratingId, data);
    await updateTargetRatingStats(rating.targetType, rating.targetId);

    return updated;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const deleteRatingService = async (userId: string, ratingId: string) => {
  try {
    const rating = await findRatingById(ratingId);

    if (!rating) throw new AppError("Rating not found", 404);
    if (rating.userId !== userId) {
      throw new AppError("You can only delete your own ratings", 403);
    }

    await deleteRating(ratingId);
    await updateTargetRatingStats(rating.targetType, rating.targetId);

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const getRatingsService = async (
  targetType: RatableType,
  targetId: string
): Promise<{ ratings: any[]; summary: RatingSummary }> => {
  try {
    await assertTargetExists(targetType, targetId);

    const [ratings, total, distribution] = await Promise.all([
      findRatingsByTarget(targetType, targetId),
      countRatingsByTarget(targetType, targetId),
      getRatingDistribution(targetType, targetId),
    ]);

    const distributionMap: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };

    let totalScore = 0;

    for (const d of distribution) {
      distributionMap[String(d.score)] = d._count;
      totalScore += d.score * d._count;
    }

    const avgRating = total > 0 ? totalScore / total : 0;

    return {
      ratings,
      summary: {
        avgRating: Math.round(avgRating * 10) / 10,
        totalRatings: total,
        distribution: distributionMap as any,
      },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const getMyRatingService = async (
  userId: string,
  targetType: RatableType,
  targetId: string
) => {
  try {
    return await findRatingByUserAndTarget(userId, targetType, targetId);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};