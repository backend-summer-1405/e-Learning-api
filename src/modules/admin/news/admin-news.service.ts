import AppError from "../../../utils/AppError.js";
import {
    adminFindNews,
    adminCountNews,
    adminFindNewsById,
    adminCreateNews,
    adminUpdateNews,
    adminDeleteNews,
} from "./admin-news.repository.js";
import type { AdminGetNewsQuery } from "./admin-news.types.js";

export const adminGetNewsService = async (
    query: AdminGetNewsQuery
) => {
    try {
        const [news, total] = await Promise.all([
            adminFindNews(query),
            adminCountNews(query),
        ]);

        return {
            news,
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / query.limit),
            },
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const adminGetNewsByIdService = async (
    id: string
) => {
    try {
        const news = await adminFindNewsById(id);
        if (!news) throw new AppError("News not found", 404);
        return news;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const adminCreateNewsService = async (
    data: {
        title: string;
        content: string;
        images?: string[];
    }) => {
    try {
        return await adminCreateNews(data);
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const adminUpdateNewsService = async (
    id: string,
    data: {
        title?: string;
        content?: string;
    }
) => {
    try {
        const news = await adminFindNewsById(id);
        if (!news) throw new AppError("News not found", 404);

        return await adminUpdateNews(id, data);
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const adminDeleteNewsService = async (id: string) => {
    try {
        const news = await adminFindNewsById(id);
        if (!news) throw new AppError("News not found", 404);

        await adminDeleteNews(id);
        return { success: true };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};