import prisma from "../../../config/prisma.js";
import type { AdminGetPodcastsQuery } from "./admin-podcast.types.js";

const adminPodcastSelect = {
    id: true,
    title: true,
    slug: true,
    description: true,
    audioUrl: true,
    subtitleUrl: true,
    duration: true,
    thumbnailUrl: true,
    status: true,
    rejectionReason: true,
    ratingAvg: true,
    ratingCount: true,
    likeCount: true,
    dislikeCount: true,
    playCount: true,
    commentCount: true,
    createdAt: true,
    updatedAt: true,
    teacher: {
        select: {
            id: true, name: true,
            email: true, avatarUrl: true
        },
    },
};

const buildWhere = (query: AdminGetPodcastsQuery) => {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.teacherId) where.teacherId = query.teacherId;
    if (query.search) {
        where.OR = [
            { title: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
        ];
    }
    return where;
};

export const adminFindPodcasts = async (query: AdminGetPodcastsQuery) => {
    const skip = (query.page - 1) * query.limit;
    const where = buildWhere(query);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    return prisma.podcast.findMany({
        where,
        select: adminPodcastSelect,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: query.limit,
    });
};

export const adminCountPodcasts = async (query: AdminGetPodcastsQuery) => {
    const where = buildWhere(query);
    return prisma.podcast.count({
        where
    });
};

export const adminFindPodcastById = async (id: string) => {
    return prisma.podcast.findUnique({
        where: {
            id
        },
        select: adminPodcastSelect,
    });
};

export const getPodcastPlayStats = async (podcastId: string) => {
    const [totalPlays, uniqueListeners] = await Promise.all([
        prisma.podcastPlay.count({
            where: {
                podcastId
            }
        }),
        prisma.podcastPlay.findMany({
            where: { podcastId, userId: { not: null } },
            select: { userId: true },
            distinct: ["userId"],
        }),
    ]);

    return {
        playCount: totalPlays,
        uniqueListeners: uniqueListeners.length,
    };
};

export const getTopSegments = async (podcastId: string, limit = 10) => {
    const plays = await prisma.podcastPlay.findMany({
        where: {
            podcastId
        },
        select: {
            position: true
        },
    });

    const segments = new Map<number, number>();

    for (const play of plays) {
        const segmentStart = Math.floor(play.position / 30) * 30;
        segments.set(segmentStart, (segments.get(segmentStart) ?? 0) + 1);
    }

    const sorted = Array.from(segments.entries())
        .map(([startTime, playCount]) => ({
            startTime,
            endTime: startTime + 30,
            playCount,
        }))
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, limit);

    return sorted;
};

export const getPodcastRatingDistribution = async (podcastId: string) => {
    const ratings = await prisma.rating.groupBy({
        by: ["score"],
        where: {
            targetType: "PODCAST",
            targetId: podcastId
        },
        _count: true,
    });

    const distribution: Record<string, number> = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
    };

    for (const r of ratings) {
        distribution[String(r.score)] = r._count;
    }

    return distribution;
};

export const getRecentComments = async (
    podcastId: string,
    limit = 10
) => {
    return prisma.comment.findMany({
        where: {
            targetType: "PODCAST",
            targetId: podcastId,
            deletedAt: null,
        },
        include: {
            user: {
                select: { id: true, name: true, avatarUrl: true },
            },
        },
        orderBy: {
            createdAt: "desc"
        },
        take: limit,
    });
};

export const getRecentRatings = async (podcastId: string, limit = 10) => {
    return prisma.rating.findMany({
        where: { targetType: "PODCAST", targetId: podcastId },
        include: {
            user: {
                select: { id: true, name: true, avatarUrl: true },
            },
        },
        orderBy: {
            createdAt: "desc"
        },
        take: limit,
    });
};

export const getRecentPlays = async (podcastId: string, limit = 10) => {
    return prisma.podcastPlay.findMany({
        where: { podcastId },
        include: {
            user: {
                select: { id: true, name: true, avatarUrl: true },
            },
        },
        orderBy: {
            createdAt: "desc"
        },
        take: limit,
    });
};

export const adminApprovePodcast = async (id: string) => {
    return prisma.podcast.update({
        where: { id },
        data: { status: "APPROVED", rejectionReason: null },
    });
};

export const adminRejectPodcast = async (
    id: string,
    reason: string
) => {
    return prisma.podcast.update({
        where: {
            id
        },
        data: {
            status: "REJECTED",
            rejectionReason: reason
        },
    });
};

export const adminDeletePodcast = async (id: string) => {
    return prisma.podcast.delete({ where: { id } });
};