import prisma from "../../config/prisma.js";
import {
  ReactionTargetType,
  ReactionActionType,
  CreateReactionInput,
} from "./reaction.types.js";

export const reactionRepository = {
  findByUserAndTarget: (
    userId: string,
    targetType: ReactionTargetType,
    targetId: string,
  ) => {
    return prisma.reaction.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType,
          targetId,
        },
      },
    });
  },

  create: (data: CreateReactionInput) => {
    return prisma.reaction.create({
      data,
    });
  },

  update: (id: string, type: ReactionActionType) => {
    return prisma.reaction.update({
      where: { id },
      data: { type },
    });
  },

  delete: (id: string) => {
    return prisma.reaction.delete({
      where: { id },
    });
  },

  countByTarget: (
    targetType: ReactionTargetType,
    targetId: string,
  ) => {
    return prisma.reaction.groupBy({
      by: ["type"],
      where: {
        targetType,
        targetId,
      },
      _count: {
        _all: true,
      },
    });
  },
};