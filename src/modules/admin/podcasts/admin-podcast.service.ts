import AppError from "../../../utils/AppError.js";
import {
  adminFindPodcasts,
  adminCountPodcasts,
  adminFindPodcastById,
  getPodcastPlayStats,
  getTopSegments,
  getPodcastRatingDistribution,
  getRecentComments,
  getRecentRatings,
  getRecentPlays,
  adminApprovePodcast,
  adminRejectPodcast,
  adminDeletePodcast,
} from "./admin-podcast.repository.js";
import type { AdminGetPodcastsQuery } from "./admin-podcast.types.js";
import { clearPodcastCache } from "../../../utils/cache.utils.js";

export const adminGetPodcastsService = async (query: AdminGetPodcastsQuery) => {
  try {
    const [podcasts, total] = await Promise.all([
      adminFindPodcasts(query),
      adminCountPodcasts(query),
    ]);

    return {
      podcasts,
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

export const adminGetPodcastDetailService = async (id: string) => {
  try {
    const podcast = await adminFindPodcastById(id);
    if (!podcast) throw new AppError("Podcast not found", 404);

    const [
      playStats,
      topSegments,
      ratingDistribution,
      recentComments,
      recentRatings,
      recentPlays,
    ] = await Promise.all([
      getPodcastPlayStats(id),
      getTopSegments(id, 10),
      getPodcastRatingDistribution(id),
      getRecentComments(id, 10),
      getRecentRatings(id, 10),
      getRecentPlays(id, 10),
    ]);

    return {
      podcast: {
        ...podcast,

        createdAt: podcast.createdAt,
        updatedAt: podcast.updatedAt,

        teacher: podcast.teacher,
      },
      stats: {
        playCount: playStats.playCount,
        uniqueListeners: playStats.uniqueListeners,
        avgRating: podcast.ratingAvg,
        totalRatings: podcast.ratingCount,
        totalComments: podcast.commentCount,
        ratingDistribution,
      },
      topSegments,
      recentComments,
      recentRatings,
      recentPlays,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminApprovePodcastService = async (id: string) => {
  try {
    const podcast = await adminFindPodcastById(id);
    if (!podcast) throw new AppError("Podcast not found", 404);
    if (podcast.status === "APPROVED")
      throw new AppError("Podcast is already approved", 400);

    await adminApprovePodcast(id);
    await clearPodcastCache();
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminRejectPodcastService = async (
  id: string,
  reason: string
) => {
  try {
    const podcast = await adminFindPodcastById(id);
    if (!podcast) throw new AppError("Podcast not found", 404);
    if (podcast.status === "REJECTED")
      throw new AppError("Podcast is already rejected", 400);

    await adminRejectPodcast(id, reason);
    await clearPodcastCache();
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminDeletePodcastService = async (id: string) => {
  try {
    const podcast = await adminFindPodcastById(id);
    if (!podcast) throw new AppError("Podcast not found", 404);

    await adminDeletePodcast(id);
    await clearPodcastCache();
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};