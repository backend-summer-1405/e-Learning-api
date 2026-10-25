import type { Request, Response, NextFunction } from "express";
import {
    enrollInCourseService,
    getMyEnrollmentsService,
    getEnrollmentByIdService,
    cancelEnrollmentService,
} from "./enrollment.service.js";

export const enrollInCourseController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const { courseId } = req.params;

        const enrollment = await enrollInCourseService(
            userId,
            courseId as string
        );

        res.status(201).json({
            success: true,
            data: enrollment,
            message: "Enrolled successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getMyEnrollmentsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const enrollments = await getMyEnrollmentsService(userId);

        res.status(200).json({
            success: true,
            data: enrollments,
        });
    } catch (error) {
        next(error);
    }
};

export const getEnrollmentByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const { id } = req.params;

        const enrollment = await getEnrollmentByIdService(
            id as string,
            userId
        );

        res.status(200).json({
            success: true,
            data: enrollment,
        });
    } catch (error) {
        next(error);
    }
};

export const cancelEnrollmentController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const { id } = req.params;

        const result = await cancelEnrollmentService(
            id as string,
            userId
        );

        res.status(200).json({
            success: true,
            data: result,
            message: "Enrollment cancelled",
        });
    } catch (error) {
        next(error);
    }
};