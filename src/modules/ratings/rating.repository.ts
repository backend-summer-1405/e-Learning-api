import prisma from "../../config/prisma.js";
import type { RatableType } from "@prisma/client";

export const findRatingByUserAndTarget = async (
    userId: string,
    targetType: RatableType,
    targetId: string
) => {
    return prisma.rating.findUnique({
        where: {
            userId_targetType_targetId: { userId, targetType, targetId },
        },
        select: {
            id: true,
            userId: true,
            targetType: true,
            targetId: true,
            score: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const findRatingById = async (
    id: string
) => {
    return prisma.rating.findUnique({
        where: { id },
        select: {
            id: true,
            userId: true,
            targetType: true,
            targetId: true,
            score: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
        },
    })
};

export const createRating = async (data: {
    userId: string;
    targetType: RatableType;
    targetId: string;
    score: number;
    comment?: string;
}) => {
    return prisma.rating.create({
        data,
        select: {
            id: true,
            userId: true,
            targetType: true,
            targetId: true,
            score: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const updateRating = async (
    id: string,
    data: { score?: number; comment?: string }
) => {
    return prisma.rating.update({
        where: {
            id
        },
        data,
        select: {
            id: true,
            userId: true,
            targetType: true,
            targetId: true,
            score: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const deleteRating = async (id: string) => {
    return prisma.rating.delete({ where: { id } });
};

export const findRatingsByTarget = async (
    targetType: RatableType,
    targetId: string
) => {
    return prisma.rating.findMany({
        where: { targetType, targetId },
        include: {
            user: {
                select: { id: true, name: true, avatarUrl: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const countRatingsByTarget = async (
    targetType: RatableType,
    targetId: string
) => {
    return prisma.rating.count({
        where: {
            targetType,
            targetId
        },
    });

};

export const getRatingDistribution = async (
    targetType: RatableType,
    targetId: string
) => {
    return prisma.rating.groupBy({
        by: ["score"],
        where: { targetType, targetId },
        _count: true,
    });
};

export const updateTargetRatingStats = async (
    targetType: RatableType,
    targetId: string
) => {
    const stats = await prisma.rating.aggregate({
        where: { targetType, targetId },
        _avg: {
            score: true
        },
        _count: true,
    });

    const ratingAvg = stats._avg.score ?? 0;
    const ratingCount = stats._count ?? 0;

    switch (targetType) {
        case "COURSE": {
            await prisma.course.update({
                where: { id: targetId },
                data: { ratingAvg, ratingCount },
            });
            break;
        }
        case "NEWS": {
            await prisma.news.update({
                where: { id: targetId },
                data: { ratingAvg, ratingCount },
            });
            break;
        }
        case "PODCAST": {
            await prisma.podcast.update({
                where: { id: targetId },
                data: { ratingAvg, ratingCount },
            });
            break;
        }
    }
};