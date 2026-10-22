import type { Request, Response, NextFunction } from "express";
import { createRatingService, updateRatingService, deleteRatingService, getRatingsService, getMyRatingService, } from "./rating.service.js";
import type { RatableType } from "@prisma/client";

export const createRatingController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const rating = await createRatingService(userId, req.body);

        res.status(201).json({
            success: true,
            data: rating,
            message: "Rating created",
        });
    } catch (error) {
        next(error);
    }
};

export const updateRatingController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const { id } = req.params;
        const rating = await updateRatingService(userId, id as string, req.body);

        res.status(200).json({
            success: true,
            data: rating,
            message: "Rating updated",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRatingController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const { id } = req.params;
        const result = await deleteRatingService(userId, id as string);

        res.status(200).json({
            success: true,
            data: result,
            message: "Rating deleted",
        });
    } catch (error) {
        next(error);
    }
};

export const getRatingsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { targetType, targetId } = req.params;
        const result = await getRatingsService(
            targetType as RatableType,
            targetId as string
        );

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getMyRatingController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const { targetType, targetId } = req.params;

        const rating = await getMyRatingService(
            userId,
            targetType as RatableType,
            targetId as string
        );

        res.status(200).json({ success: true, data: rating });
    } catch (error) {
        next(error);
    }
};