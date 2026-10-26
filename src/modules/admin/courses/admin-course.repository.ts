import prisma from "../../../config/prisma.js";
import type { AdminGetCoursesQuery } from "./admin-course.types.js";

const adminCourseSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  price: true,
  isFree: true,
  status: true,
  level: true,
  language: true,
  thumbnailUrl: true,
  previewVideoUrl: true,
  rejectionReason: true,
  ratingAvg: true,
  ratingCount: true,
  likeCount: true,
  dislikeCount: true,
  enrollmentCount: true,
  createdAt: true,
  updatedAt: true,
  teacher: {
    select: { id: true, name: true, email: true, avatarUrl: true },
  },
};

const buildWhere = (query: AdminGetCoursesQuery) => {
  const where: any = {};
  if (query.status) where.status = query.status;
  if (query.level) where.level = query.level;
  if (query.teacherId) where.teacherId = query.teacherId;
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }
  return where;
};

export const adminFindCourses = async (query: AdminGetCoursesQuery) => {
  const skip = (query.page - 1) * query.limit;
  const where = buildWhere(query);

  return prisma.course.findMany({
    where,
    select: adminCourseSelect,
    orderBy: { createdAt: "desc" },
    skip,
    take: query.limit,
  });
};

export const adminCountCourses = async (query: AdminGetCoursesQuery) => {
  const where = buildWhere(query);
  return prisma.course.count({ where });
};

export const adminFindCourseById = async (id: string) => {
  return prisma.course.findUnique({
    where: { id },
    select: adminCourseSelect,
  });
};

export const adminApproveCourse = async (id: string) => {
  return prisma.course.update({
    where: { id },
    data: { status: "APPROVED", rejectionReason: null },
    select: adminCourseSelect,
  });
};

export const adminRejectCourse = async (id: string, reason: string) => {
  return prisma.course.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: reason },
    select: adminCourseSelect,
  });
};

export const adminDeleteCourse = async (id: string) => {
  return prisma.course.delete({ where: { id } });
};