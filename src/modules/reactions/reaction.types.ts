import { ReactableType, ReactionType } from "@prisma/client";

export type ReactionTargetType = ReactableType;
export type ReactionActionType = ReactionType;

export interface CreateReactionInput {
  userId: string;
  targetId: string;
  targetType: ReactionTargetType;
  type: ReactionActionType;
}