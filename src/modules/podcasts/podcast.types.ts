import type { PodcastStatus } from "@prisma/client";

export type CreatePodcastInput = {
    title: string;
    description: string;
    audioUrl: string;
    duration: number;
    thumbnailUrl?: string;
}

export type UpdatePodcastInput = {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
}

export type PodcastResponse = {
    id: string;
    title: string;
    slug: string;
    description: string;
    audioUrl: string;
    subtitleUrl: string | null;
    duration: number;
    thumbnailUrl: string | null;
    status: PodcastStatus;
    ratingAvg: number;
    ratingCount: number;
    likeCount: number;
    dislikeCount: number;
    playCount: number;
    commentCount: number;
    teacher: {
        id: string;
            name: string;
        avatarUrl: string | null
    };
    createdAt: Date;
}