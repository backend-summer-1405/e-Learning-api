import prisma from "../../config/prisma.js";
import type { CourseLevel } from "@prisma/client";
import type { GetCoursesQuery } from "./course.types.js";
import { Prisma } from "@prisma/client";  

export const courseListSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  price: true,
  isFree: true,
  level: true,
  language: true,
  thumbnailUrl: true,
  ratingAvg: true,
  ratingCount: true,
  enrollmentCount: true,
  createdAt: true,
  teacher: {
    select: { id: true, name: true, avatarUrl: true },
  },
} as const;

export const findCourseBySlug = async (slug: string) => {
  return prisma.course.findUnique({
    where: { slug },
    select: courseListSelect,
  });
};

export const findCourseById = async (id: string) => {
  return prisma.course.findUnique({
    where: { id },
    select: courseListSelect,
  });
};

export const findCourseTeacherAndStatus = async (id: string) => {
  return prisma.course.findUnique({
    where: { id },
    select: { teacherId: true, status: true },
  });
};

export const findCourseDetailBySlug = async (slug: string) => {
  return prisma.course.findUnique({
    where: { slug },
    select: {
      ...courseListSelect,
      previewVideoUrl: true,
      likeCount: true,
      dislikeCount: true,
      sections: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          order: true,
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              duration: true,
              order: true,
              isFree: true,
            },
          },
        },
      },
      images: {
        orderBy: { order: "asc" },
        select: { id: true, url: true, isPrimary: true },
      },
    },
  });
};

export const findCourses = async (query: GetCoursesQuery) => {
  const skip = (query.page - 1) * query.limit;

  const where: any = { status: "APPROVED" };

  if (query.isFree !== undefined) where.isFree = query.isFree;
  if (query.level) where.level = query.level;
  if (query.language) where.language = query.language;

  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder ?? "desc";

  return prisma.course.findMany({
    where,
    select: courseListSelect,
    orderBy: { [sortBy]: sortOrder },
    skip,
    take: query.limit,
  });
};

export const countCourses = async (query: GetCoursesQuery) => {
  const where: any = { status: "APPROVED" };
  if (query.isFree !== undefined) where.isFree = query.isFree;
  if (query.level) where.level = query.level;
  if (query.language) where.language = query.language;

  return prisma.course.count({ where });
};

// ★ سرچ فازی امن
export const searchCoursesFuzzy = async (query: GetCoursesQuery) => {
  const skip = (query.page - 1) * query.limit;
  const search = query.search!;

  const conditions: any[] = [Prisma.sql`c.status = 'APPROVED'`];

  if (query.isFree !== undefined) {
    conditions.push(Prisma.sql`c."isFree" = ${query.isFree}`);
  }
  if (query.level) {
    conditions.push(Prisma.sql`c.level = ${query.level}::"CourseLevel"`);
  }
  if (query.language) {
    conditions.push(Prisma.sql`c.language = ${query.language}`);
  }

  const whereClause = Prisma.join(conditions, " AND ");

  const allowedSortColumns = [
    "createdAt",
    "price",
    "ratingAvg",
    "enrollmentCount",
  ];
  const safeSortBy = allowedSortColumns.includes(query.sortBy ?? "")
    ? query.sortBy!
    : "createdAt";
  const safeSortOrder = query.sortOrder === "asc" ? "ASC" : "DESC";

  const rows = await prisma.$queryRaw<any[]>`
    SELECT 
      c.id, c.title, c.slug, c.description, c.price, c."isFree", 
      c.level, c.language, c."thumbnailUrl", c."ratingAvg", 
      c."ratingCount", c."enrollmentCount", c."createdAt",
      u.id AS "teacherId", u.name AS "teacherName", u."avatarUrl" AS "teacherAvatar",
      GREATEST(
        similarity(c.title, ${search}),
        similarity(c.description, ${search})
      ) AS score
    FROM "Course" c
    JOIN "User" u ON u.id = c."teacherId"
    WHERE ${whereClause}
      AND (
        c.title % ${search}
        OR c.description % ${search}
        OR similarity(c.title, ${search}) > 0.2
        OR similarity(c.description, ${search}) > 0.2
      )
    ORDER BY ${Prisma.raw(`c."${safeSortBy}"`)} ${Prisma.raw(safeSortOrder)}
    LIMIT ${query.limit} OFFSET ${skip}
  `;

  return rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    price: row.price,
    isFree: row.isFree,
    level: row.level,
    language: row.language,
    thumbnailUrl: row.thumbnailUrl,
    ratingAvg: row.ratingAvg,
    ratingCount: row.ratingCount,
    enrollmentCount: row.enrollmentCount,
    createdAt: row.createdAt,
    teacher: {
      id: row.teacherId,
      name: row.teacherName,
      avatarUrl: row.teacherAvatar,
    },
  }));
};

export const countSearchCoursesFuzzy = async (query: GetCoursesQuery) => {
  const search = query.search!;

  const conditions: any[] = [Prisma.sql`c.status = 'APPROVED'`];

  if (query.isFree !== undefined) {
    conditions.push(Prisma.sql`c."isFree" = ${query.isFree}`);
  }
  if (query.level) {
    conditions.push(Prisma.sql`c.level = ${query.level}::"CourseLevel"`);
  }
  if (query.language) {
    conditions.push(Prisma.sql`c.language = ${query.language}`);
  }

  const whereClause = Prisma.join(conditions, " AND ");

  const result = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::bigint AS count
    FROM "Course" c
    WHERE ${whereClause}
      AND (
        c.title % ${search}
        OR c.description % ${search}
        OR similarity(c.title, ${search}) > 0.2
        OR similarity(c.description, ${search}) > 0.2
      )
  `;

  return Number(result[0]?.count ?? 0);
};

export const createCourse = async (data: {
  title: string;
  slug: string;
  description: string;
  price: number;
  isFree: boolean;
  level: CourseLevel;
  language: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  teacherId: string;
  status: "DRAFT" | "PENDING";
}) => {
  return prisma.course.create({
    data,
    select: courseListSelect,
  });
};

export const updateCourse = async (
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    description: string;
    price: number;
    isFree: boolean;
    level: CourseLevel;
    language: string;
    thumbnailUrl: string | null;
    previewVideoUrl: string | null;
    status: "PENDING";
  }>
) => {
  return prisma.course.update({
    where: { id },
    data,
    select: courseListSelect,
  });
};

export const deleteCourse = async (id: string) => {
  return prisma.course.delete({ where: { id } });
};

export const findCourseSlugExists = async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true },
  });
  return !!course;
};