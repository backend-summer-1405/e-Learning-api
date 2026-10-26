import prisma from "../../config/prisma.js";
import type { PodcastStatus } from "@prisma/client";

const podcastSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  audioUrl: true,
  subtitleUrl: true,
  duration: true,
  thumbnailUrl: true,
  status: true,
  ratingAvg: true,
  ratingCount: true,
  likeCount: true,
  dislikeCount: true,
  playCount: true,
  commentCount: true,
  createdAt: true,
  teacher: { select: { id: true, name: true, avatarUrl: true } },
};

export const findPodcastBySlug = async (slug: string) => {
  return prisma.podcast.findUnique({ where: { slug }, select: podcastSelect });
};

export const findPodcastById = async (id: string) => {
  return prisma.podcast.findUnique({ where: { id }, select: podcastSelect });
};

export const findPodcasts = async (query: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const skip = (query.page - 1) * query.limit;
  const where: any = { status: "APPROVED" };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  return prisma.podcast.findMany({
    where,
    select: podcastSelect,
    orderBy: { createdAt: "desc" },
    skip,
    take: query.limit,
  });
};

export const countPodcasts = async (query: { search?: string }) => {
  const where: any = { status: "APPROVED" };
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }
  return prisma.podcast.count({ where });
};

export const createPodcast = async (data: {
  title: string;
  slug: string;
  description: string;
  audioUrl: string;
  subtitleUrl: string | null;
  duration: number;
  thumbnailUrl?: string;
  teacherId: string;
  status: PodcastStatus;
}) => {
  return prisma.podcast.create({ data, select: podcastSelect });
};

export const updatePodcast = async (id: string, data: any) => {
  return prisma.podcast.update({ where: { id }, data, select: podcastSelect });
};

export const deletePodcast = async (id: string) => {
  return prisma.podcast.delete({ where: { id } });
};

export const findPodcastTeacherAndStatus = async (id: string) => {
  return prisma.podcast.findUnique({
    where: { id },
    select: { teacherId: true, status: true },
  });
};

export const findPodcastSlugExists = async (slug: string) => {
  const p = await prisma.podcast.findUnique({
    where: { slug },
    select: { id: true },
  });
  return !!p;
};

export const incrementPlayCount = async (id: string) => {
  return prisma.podcast.update({
    where: { id },
    data: { playCount: { increment: 1 } },
  });
};

export const createPodcastPlay = async (data: {
  podcastId: string;
  userId?: string;
  position: number;
}) => {
  return prisma.podcastPlay.create({ data });
};

export const findPodcastProgress = async (userId: string, podcastId: string) => {
  return prisma.podcastProgress.findUnique({
    where: { userId_podcastId: { userId, podcastId } },
  });
};

export const upsertPodcastProgress = async (
  userId: string,
  podcastId: string,
  data: { lastPosition: number; completedSegments?: any }
) => {
  return prisma.podcastProgress.upsert({
    where: { userId_podcastId: { userId, podcastId } },
    update: data,
    create: { userId, podcastId, ...data },
  });
};