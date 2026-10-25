import prisma from "../../../config/prisma.js";

export const findLessonById = async (id: string) => {
  return prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      sectionId: true,
      title: true,
      videoUrl: true,
      duration: true,
      order: true,
      isFree: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findLessonsBySection = async (sectionId: string) => {
  return prisma.lesson.findMany({
    where: { sectionId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      sectionId: true,
      title: true,
      videoUrl: true,
      duration: true,
      order: true,
      isFree: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createLesson = async (data: {
  sectionId: string;
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
  isFree: boolean;
}) => {
  return prisma.lesson.create({
    data,
    select: {
      id: true,
      sectionId: true,
      title: true,
      videoUrl: true,
      duration: true,
      order: true,
      isFree: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateLesson = async (
  id: string,
  data: Partial<{
    title: string;
    videoUrl: string;
    duration: number;
    order: number;
    isFree: boolean;
  }>
) => {
  return prisma.lesson.update({
    where: { id },
    data,
    select: {
      id: true,
      sectionId: true,
      title: true,
      videoUrl: true,
      duration: true,
      order: true,
      isFree: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteLesson = async (id: string) => {
  return prisma.lesson.delete({ where: { id } });
};

export const countLessonsBySection = async (sectionId: string) => {
  return prisma.lesson.count({ where: { sectionId } });
};