import { CourseLevel, CourseStatus } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import { adminApproveCourseService, adminDeleteCourseService, adminGetCoursesService, adminRejectCourseService } from "./admin-course.service.js";






export const adminGetCoursesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await adminGetCoursesService({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 20),
            status: req.query.status as CourseStatus | undefined,
            level: req.query.level as CourseLevel | undefined,
            teacherId: req.query.teacherId as string | undefined,
            search: req.query.search as string | undefined,
        });

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

export const adminApproveCourseController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const result = await adminApproveCourseService(id as string)
        res.status(200).json({
            success: true,
            data: result,
            message: "Course approved"
        })
    } catch (err) {
        next(err)
    }
}

export const adminRejectCourseController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const result = await adminRejectCourseService(id as string, reason);
        res.status(200).json({
            success: true,
            data: result,
            message: "Course rejected",
        });
    } catch (err) {
        next(err);
    }
};




export const adminDeleteCourseController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const result = await adminDeleteCourseService(id as string);
        res.status(200).json({
            success: true,
            data: result,
            message: "Course deleted",
        });
    } catch (err) {
        next(err)
    }
};