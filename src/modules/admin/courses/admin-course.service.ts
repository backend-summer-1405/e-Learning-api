import AppError from "../../../utils/AppError.js";
import {
  adminFindCourses,
  adminCountCourses,
  adminFindCourseById,
  adminApproveCourse,
  adminRejectCourse,
  adminDeleteCourse,
} from "./admin-course.repository.js";
import type {
  AdminGetCoursesQuery,
  AdminGetCoursesResult,
  AdminActionSuccess,
} from "./admin-course.types.js";

export const adminGetCoursesService = async (
  query: AdminGetCoursesQuery
): Promise<AdminGetCoursesResult> => {
  try {
    const [courses, total] = await Promise.all([
      adminFindCourses(query),
      adminCountCourses(query),
    ]);

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

export const adminApproveCourseService = async (
  id: string
): Promise<AdminActionSuccess> => {
  try {
    const course = await adminFindCourseById(id);
    if (!course) throw new AppError("Course not found", 404);
    if (course.status === "APPROVED")
      throw new AppError("Course is already approved", 400);

    await adminApproveCourse(id);
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminRejectCourseService = async (
  id: string,
  reason: string
): Promise<AdminActionSuccess> => {
  try {
    const course = await adminFindCourseById(id);
    if (!course) throw new AppError("Course not found", 404);
    if (course.status === "REJECTED")
      throw new AppError("Course is already rejected", 400);

    await adminRejectCourse(id, reason);
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminDeleteCourseService = async (
  id: string
): Promise<AdminActionSuccess> => {
  try {
    const course = await adminFindCourseById(id);
    if (!course) throw new AppError("Course not found", 404);

    await adminDeleteCourse(id);
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};