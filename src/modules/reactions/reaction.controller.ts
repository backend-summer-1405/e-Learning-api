import type { Request, Response, NextFunction } from "express";
import { reactionService } from "./reaction.service.js";

const service = reactionService();

export const reactionController = () => {
    const setReaction = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = res.locals.userId as string;
            const { targetType, targetId } = req.params;
            const { type } = req.body;
            const reaction = await service.setReaction(userId, {
                targetType: targetType as "NEWS" | "COURSE" | "PODCAST",
                targetId: targetId as string,
                type,
            });



            res.status(200).json({
                success: true,
                message: "Reaction saved successfully",
                data: reaction,
            });
        } catch (error) {
            next(error);
        }
    };
    const removeReaction = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = res.locals.userId as string;
            const { targetType, targetId } = req.params;

            await service.removeReaction(
                userId,
                targetType as "NEWS" | "COURSE" | "PODCAST",
                targetId as string,
            );

            res.status(200).json({
                success: true,
                message: "Reaction removed successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    const getReactionCounts = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { targetType, targetId } = req.params;

            const counts = await service.getReactionCounts(
                targetType as "NEWS" | "COURSE" | "PODCAST",
                targetId as string,
            );

            res.status(200).json({
                success: true,
                data: counts,
            });
        } catch (error) { next(error) }
    };



    return {
        setReaction,
        removeReaction,
        getReactionCounts,
    };
};