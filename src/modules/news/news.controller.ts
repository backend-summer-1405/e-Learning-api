import type { Request, Response, NextFunction } from "express";
import {
    createNewsService,
    getAllNewsService,
    getNewsByIdService,
} from "./news.service.js";
import AppError from "../../utils/AppError.js";

export const createNewsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const imageUrl = req.file
            ? `uploads/news/${req.file.filename}`
            : undefined;

        const news = await createNewsService(
            {
                title: req.body.title,
                content: req.body.content,
            },
            imageUrl,
        );

        res.status(201).json({
            status: "success",
            data: {
                news,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getAllNewsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const news = await getAllNewsService();

        res.status(200).json({
            status: "success",
            results: news.length,
            data: {
                news,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getNewsByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (typeof id !== "string") {
            throw new AppError("Invalid news ID", 400);
        }



        const news = await getNewsByIdService(id);

        res.status(200).json({
            status: "success",
            data: {
                news,
            },
        });
    } catch (error) {
        next(error);
    }
};