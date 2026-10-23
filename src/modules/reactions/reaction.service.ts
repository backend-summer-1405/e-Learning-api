import logger from "../../config/logger.js";
import AppError from "../../utils/AppError.js";
import { reactionRepository } from "./reaction.repository.js";
import { reactionTargetRepository } from "./reaction-target.repository.js";
import prisma from "../../config/prisma.js";
import type { CreateReactionInput } from "./reaction.types.js";

export const reactionService = () => {
    const validateTarget = async (
        targetType: CreateReactionInput["targetType"],
        targetId: string
    ) => {
        const targetExists = await reactionTargetRepository.exists(
            targetType,
            targetId
        );

        if (!targetExists) {
            throw new AppError(`${targetType} not found`, 404);
        }
    };

    const updateCourseReactionCounts = async (
        courseId: string
    ) => {
        const [likes, dislikes] = await Promise.all([
            prisma.reaction.count({
                where: {
                    targetType: "COURSE",
                    targetId: courseId,
                    type: "LIKE"
                },
            }),
            prisma.reaction.count({
                where: {
                    targetType: "COURSE",
                    targetId: courseId,
                    type: "DISLIKE"
                },
            }),
        ]);

        await prisma.course.update({
            where: { id: courseId },
            data: {
                likeCount: likes,
                dislikeCount: dislikes
            },
        });
    };

    const setReaction = async (
        userId: string,
        input: Omit<CreateReactionInput, "userId">
    ) => {
        await validateTarget(input.targetType, input.targetId);

        const existingReaction = await reactionRepository.findByUserAndTarget(
            userId,
            input.targetType,
            input.targetId
        );

        let reaction;

        if (!existingReaction) {
            reaction = await reactionRepository.create(
                { ...input, userId }
            );

            logger.info("Reaction created successfully", {
                userId,
                targetType: input.targetType,
                targetId: input.targetId,
                type: input.type,
            });
        } else if (existingReaction.type === input.type) {
            return existingReaction;
        } else {
            reaction = await reactionRepository.update(
                existingReaction.id,
                input.type
            );

            logger.info("Reaction updated successfully", {
                userId,
                targetType: input.targetType,
                targetId: input.targetId,
                previousType: existingReaction.type,
                newType: input.type,
            });
        }

        if (input.targetType === "COURSE") {
            await updateCourseReactionCounts(input.targetId);
        }

        return reaction;
    };

    const removeReaction = async (
        userId: string,
        targetType: CreateReactionInput["targetType"],
        targetId: string
    ) => {
        await validateTarget(targetType, targetId);

        const existingReaction = await reactionRepository.findByUserAndTarget(
            userId,
            targetType,
            targetId
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

        if (targetType === "COURSE") {
            await updateCourseReactionCounts(targetId);
        }

        return reaction;
    };

    const getReactionCounts = async (
        targetType: CreateReactionInput["targetType"],
        targetId: string
    ) => {
        await validateTarget(targetType, targetId);

        const counts = await reactionRepository.countByTarget(
            targetType,
            targetId
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