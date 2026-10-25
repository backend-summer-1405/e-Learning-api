import type { Request, Response, NextFunction } from "express";
import {
    getSectionsService,
    createSectionService,
    updateSectionService,
    deleteSectionService,
} from "./section.service.js";

export const getSectionsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { courseId } = req.params;
        const sections = await getSectionsService(courseId as string);

        res.status(200).json({
            success: true,
            data: sections,
        });
    } catch (error) {
        next(error);
    }
};

export const createSectionController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const userRole = res.locals.role as string;
        const { courseId } = req.params;

        const section = await createSectionService(
            courseId as string,
            userId,
            userRole,
            req.body
        );

        res.status(201).json({
            success: true,
            data: section,
            message: "Section created successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const updateSectionController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const userRole = res.locals.role as string;
        const { id } = req.params;

        const section = await updateSectionService(
            id as string,
            userId,
            userRole,
            req.body
        );

        res.status(200).json({
            success: true,
            data: section,
            message: "Section updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSectionController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const userRole = res.locals.role as string;
        const { id } = req.params;

        const result = await deleteSectionService(
            id as string,
            userId,
            userRole
        );

        res.status(200).json({
            success: true,
            data: result,
            message: "Section deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};