import type { RatableType } from "@prisma/client";

export type CreateRatingInput = {
  targetType: RatableType;
  targetId: string;
  score: number;
  comment?: string;
}

export type UpdateRatingInput = {
  score?: number;
  comment?: string;
  
}

export type RatingDistribution = {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
};

export type RatingSummary = {

  avgRating: number;
  totalRatings: number;
  distribution: RatingDistribution;
}