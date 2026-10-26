import AppError from "../../utils/AppError.js";
import path from "node:path";
import fs from "node:fs/promises";
import {
  findPodcastBySlug,
  findPodcastById,
  findPodcasts,
  countPodcasts,
  createPodcast,
  updatePodcast,
  deletePodcast,
  findPodcastTeacherAndStatus,
  findPodcastSlugExists,
  incrementPlayCount,
  createPodcastPlay,
  findPodcastProgress,
  upsertPodcastProgress,
} from "./podcast.repository.js";
import { generatePodcastSubtitleService } from "./podcast-subtitle.service.js";
import type {
  CreatePodcastInput,
  UpdatePodcastInput,
} from "./podcast.types.js";

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const generateUniqueSlug = async (title: string): Promise<string> => {
  const base = slugify(title);
  let slug = base;
  let counter = 1;
  while (await findPodcastSlugExists(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
};

const deleteFile = async (url: string) => {
  const filePath = path.resolve(url.replace(/^\/+/, ""));
  try {
    await fs.unlink(filePath);
  } catch {}
};

export const getPodcastsService = async (query: {
  page: number;
  limit: number;
  search?: string;
}) => {
  try {
    const [podcasts, total] = await Promise.all([
      findPodcasts(query),
      countPodcasts(query),
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

export const getPodcastDetailService = async (slug: string) => {
  try {
    const podcast = await findPodcastBySlug(slug);
    if (!podcast) throw new AppError("Podcast not found", 404);
    return podcast;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const createPodcastService = async (
  teacherId: string,
  userRole: string,
  data: CreatePodcastInput,
  audioFilePath: string
) => {
  try {
    const slug = await generateUniqueSlug(data.title);
    const status = userRole === "ADMIN" ? "APPROVED" : "PENDING";

    const podcast = await createPodcast({
      title: data.title.trim(),
      slug,
      description: data.description.trim(),
      audioUrl: data.audioUrl,
      subtitleUrl: null,
      duration: data.duration,
      thumbnailUrl: data.thumbnailUrl,
      teacherId,
      status: status as any,
    });

    try {
      const subtitleUrl = await generatePodcastSubtitleService(
        audioFilePath,
        podcast.id
      );
      return await updatePodcast(podcast.id, { subtitleUrl });
    } catch (subtitleError) {
      console.error(
        "Subtitle generation failed, podcast created without subtitle:",
        subtitleError
      );
      return podcast;
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const updatePodcastService = async (
  podcastId: string,
  userId: string,
  userRole: string,
  data: UpdatePodcastInput
) => {
  try {
    const podcast = await findPodcastById(podcastId);
    if (!podcast) throw new AppError("Podcast not found", 404);

    const teacherInfo = await findPodcastTeacherAndStatus(podcastId);
    if (!teacherInfo) throw new AppError("Podcast not found", 404);

    if (userRole !== "ADMIN" && teacherInfo.teacherId !== userId) {
      throw new AppError("You can only edit your own podcasts", 403);
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined)
      updateData.description = data.description.trim();
    if (data.thumbnailUrl !== undefined)
      updateData.thumbnailUrl = data.thumbnailUrl;

    if (userRole !== "ADMIN" && teacherInfo.status === "APPROVED") {
      updateData.status = "PENDING";
    }

    return await updatePodcast(podcastId, updateData);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const deletePodcastService = async (
  podcastId: string,
  userId: string,
  userRole: string
) => {
  try {
    const podcast = await findPodcastById(podcastId);
    if (!podcast) throw new AppError("Podcast not found", 404);

    const teacherInfo = await findPodcastTeacherAndStatus(podcastId);
    if (!teacherInfo) throw new AppError("Podcast not found", 404);

    if (userRole !== "ADMIN" && teacherInfo.teacherId !== userId) {
      throw new AppError("You can only delete your own podcasts", 403);
    }

    if (podcast.audioUrl) await deleteFile(podcast.audioUrl);
    if (podcast.thumbnailUrl) await deleteFile(podcast.thumbnailUrl);
    if (podcast.subtitleUrl) await deleteFile(podcast.subtitleUrl);

    await deletePodcast(podcastId);
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const trackPlayService = async (
  podcastId: string,
  userId: string | undefined,
  position: number
) => {
  try {
    await incrementPlayCount(podcastId);
    await createPodcastPlay({ podcastId, userId, position });
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const saveProgressService = async (
  userId: string,
  podcastId: string,
  lastPosition: number
) => {
  try {
    return await upsertPodcastProgress(userId, podcastId, { lastPosition });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const getProgressService = async (
  userId: string,
  podcastId: string
) => {
  try {
    const progress = await findPodcastProgress(userId, podcastId);
    return progress ?? { lastPosition: 0 };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};