import type { Request, Response, NextFunction } from "express";
import {
    getCourseImagesService,
    addCourseImagesService,
    setPrimaryCourseImageService,
    deleteCourseImageService,
} from "./course-image.service.js";
import AppError from "../../../utils/AppError.js";

export const getCourseImagesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { courseId } = req.params;
        const images = await getCourseImagesService(courseId as string);

        res.status(200).json({
            success: true,
            data: images,
        });
    } catch (error) {
        next(error);
    }
};

export const addCourseImagesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const userRole = res.locals.role as string;
        const { courseId } = req.params;
        const files = req.files;

        if (!Array.isArray(files) || files.length === 0) {
            throw new AppError("At least one image is required", 400);
        }

        const urls = files.map((file) => `/uploads/courses/${file.filename}`);
        const images = await addCourseImagesService(
            courseId as string,
            userId,
            userRole,
            urls
        );

        res.status(201).json({ success: true, data: images, message: "Images added" });
    } catch (error) {
        next(error);
    }
};

export const setPrimaryCourseImageController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const userRole = res.locals.role as string;
        const { courseId, imageId } = req.params;

        const image = await setPrimaryCourseImageService(
            courseId as string,
            imageId as string,
            userId,
            userRole
        );

        res.status(200).json({ success: true, data: image, message: "Primary image set" });
    } catch (error) {
        next(error);
    }
};

export const deleteCourseImageController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const userRole = res.locals.role as string;
        const { courseId, imageId } = req.params;

        const result = await deleteCourseImageService(
            courseId as string,
            imageId as string,
            userId,
            userRole
        );

        res.status(200).json({ success: true, data: result, message: "Image deleted" });
    } catch (error) {
        next(error);
    }
};