import logger from "../../config/logger.js";
import AppError from "../../utils/AppError.js";
import { reactionRepository } from "./reaction.repository.js";
import type { CreateReactionInput, } from "./reaction.types.js";

export const reactionService = () => {
    const setReaction = async (
        userId: string,
        input: Omit<CreateReactionInput, "userId">,
    ) => {
        const existingReaction =
            await reactionRepository.findByUserAndTarget(
                userId,
                input.targetType,
                input.targetId,
            );

        if (!existingReaction) {
            const reaction = await reactionRepository.create({
                ...input,
                userId,
            });

            logger.info("Reaction created successfully", {
                userId,
                targetType: input.targetType,
                targetId: input.targetId,
                type: input.type,
            });

            return reaction;
        }

        if (existingReaction.type === input.type) {
            return existingReaction;
        }

        const reaction = await reactionRepository.update(existingReaction.id, input.type   );

        logger.info("Reaction updated successfully", {
            userId,
            targetType: input.targetType,
            targetId: input.targetId,
            previousType: existingReaction.type,
            newType: input.type,
        });

        return reaction;
    };

    const removeReaction = async (
        userId: string,
        targetType: CreateReactionInput["targetType"],
        targetId: string,
    ) => {
        const existingReaction =
            await reactionRepository.findByUserAndTarget(
                userId,
                targetType,
                targetId,
            );

        if (!existingReaction) {
            throw new AppError("Reaction not found", 404);
        }

        const reaction = await reactionRepository.delete(existingReaction.id);

        logger.info("Reaction deleted successfully", {
            userId,
            targetType,
            targetId,
            previousType: existingReaction.type,
        });

        return reaction;
    };

    const getReactionCounts = async (
        targetType: CreateReactionInput["targetType"],
        targetId: string,
    ) => {
        const counts = await reactionRepository.countByTarget(
            targetType,
            targetId,
        );

        return {
            likes: counts.find((item) => item.type === "LIKE")?._count._all ?? 0,
            dislikes:
                counts.find((item) => item.type === "DISLIKE")?._count._all ?? 0,
        };
    };

    return {
        setReaction,
        removeReaction,
        getReactionCounts,
    };
};
