import type { Request, Response, NextFunction } from "express";
import { updateProgressService, getLessonProgressService, getCourseProgressService, } from "./progress.service.js";

export const updateProgressController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const { lessonId } = req.params;

        const progress = await updateProgressService(
            userId,
            lessonId as string,
            req.body
        );

        res.status(200).json({
            success: true,
            data: progress,
            message: "Progress updated",
        });
    } catch (error) {
        next(error);
    }
};

export const getLessonProgressController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const { lessonId } = req.params;

        const progress = await getLessonProgressService(
            userId,
            lessonId as string
        );

        res.status(200).json({
            success: true,
            data: progress,
        });
    } catch (error) {
        next(error);
    }
};

export const getCourseProgressController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const { courseId } = req.params;

        const progress = await getCourseProgressService(
            userId,
            courseId as string
        );

        res.status(200).json({
            success: true,
            data: progress,
        });
    } catch (error) {
        next(error);
    }
};