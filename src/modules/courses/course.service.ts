import { clear } from "node:console";
import { clearCourseCache } from "../../utils/cache.utils.js";
import prisma from "../../config/prisma.js";
import redis from "../../config/redis.js";
import AppError from "../../utils/AppError.js";
import {
  findCourseById,
  findCourseTeacherAndStatus,
  findCourseDetailBySlug,
  findCourses,
  countCourses,
  searchCoursesFuzzy,
  countSearchCoursesFuzzy,
  createCourse,
  updateCourse,
  deleteCourse,
  findCourseSlugExists,
} from "./course.repository.js";
import type {
  CreateCourseInput,
  UpdateCourseInput,
  GetCoursesQuery,
} from "./course.types.js";


const slugify = (
  text: string
): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const generateUniqueSlug = async (title: string): Promise<string> => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (await findCourseSlugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export const getCoursesService = async (query: GetCoursesQuery) => {
  try {
    let courses, total;

    if (query.search) {
      [courses, total] = await Promise.all([
        searchCoursesFuzzy(query),
        countSearchCoursesFuzzy(query),
      ]);
    } else {
      [courses, total] = await Promise.all([
        findCourses(query),
        countCourses(query),
      ]);
    }

    return {
      courses,
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

export const getCourseDetailService = async (slug: string) => {
  try {
    const course = await findCourseDetailBySlug(slug);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    return course;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const createCourseService = async (
  teacherId: string,
  data: CreateCourseInput,
  status: "DRAFT" | "PENDING"
) => {
  try {
    const slug = await generateUniqueSlug(data.title);

    const course = await createCourse({
      title: data.title.trim(),
      slug,
      description: data.description.trim(),
      price: data.price,
      isFree: data.price === 0,
      level: data.level,
      language: data.language ?? "fa",
      thumbnailUrl: data.thumbnailUrl,
      previewVideoUrl: data.previewVideoUrl,
      teacherId,
      status,
    });

    await clearCourseCache();

    return course;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const updateCourseService = async (
  courseId: string,
  teacherId: string,
  userRole: string,
  data: UpdateCourseInput
) => {
  try {
    const course = await findCourseById(courseId);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const teacherInfo = await findCourseTeacherAndStatus(courseId);

    if (!teacherInfo) {
      throw new AppError("Course not found", 404);
    }

    if (userRole !== "ADMIN" && teacherInfo.teacherId !== teacherId) {
      throw new AppError("You can only edit your own courses", 403);
    }

    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined)
      updateData.description = data.description.trim();
    if (data.price !== undefined) {
      updateData.price = data.price;
      updateData.isFree = data.price === 0;
    }
    if (data.level !== undefined) updateData.level = data.level;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.thumbnailUrl !== undefined)
      updateData.thumbnailUrl = data.thumbnailUrl;
    if (data.previewVideoUrl !== undefined)
      updateData.previewVideoUrl = data.previewVideoUrl;

    if (userRole !== "ADMIN" && teacherInfo.status === "APPROVED") {
      updateData.status = "PENDING";
    }


    const updated = await updateCourse(courseId, updateData);
    await clearCourseCache();
    return updated;


  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const deleteCourseService = async (
  courseId: string,
  teacherId: string,
  userRole: string
) => {
  try {
    const course = await findCourseById(courseId);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const teacherInfo = await findCourseTeacherAndStatus(courseId);

    if (!teacherInfo) {
      throw new AppError("Course not found", 404);
    }

    if (userRole !== "ADMIN" && teacherInfo.teacherId !== teacherId) {
      throw new AppError("You can only delete your own courses", 403);
    }

    await deleteCourse(courseId);
    await clearCourseCache();
    return {
      success: true
    };

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};