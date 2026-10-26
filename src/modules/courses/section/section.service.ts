import AppError from "../../../utils/AppError.js";
import {
  findSectionById,
  findSectionsByCourse,
  createSection,
  updateSection,
  deleteSection,
  countSectionsByCourse,
} from "./section.repository.js";
import {
  findCourseById,
  findCourseTeacherAndStatus,
} from "../course.repository.js";
import type { CreateSectionInput, UpdateSectionInput } from "./section.types.js";
import { clearSectionCache, clearCourseCache } from "../../../utils/cache.utils.js";

export const getSectionsService = async (courseId: string) => {
  try {
    const course = await findCourseById(courseId);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    return await findSectionsByCourse(courseId);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const createSectionService = async (
  courseId: string,
  userId: string,
  userRole: string,
  data: CreateSectionInput
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

    if (userRole !== "ADMIN" && teacherInfo.teacherId !== userId) {
      throw new AppError("You can only add sections to your own courses", 403);
    }

    let order = data.order;
    if (order === undefined) {
      order = await countSectionsByCourse(courseId);
    }

    const created = await createSection({
      courseId,
      title: data.title.trim(),
      order,
    });

    // ★ پاک کردن کش
    await clearSectionCache();
    await clearCourseCache();

    return created;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const updateSectionService = async (
  sectionId: string,
  userId: string,
  userRole: string,
  data: UpdateSectionInput
) => {
  try {
    const section = await findSectionById(sectionId);

    if (!section) {
      throw new AppError("Section not found", 404);
    }

    const teacherInfo = await findCourseTeacherAndStatus(section.courseId);

    if (!teacherInfo) {
      throw new AppError("Course not found", 404);
    }

    if (userRole !== "ADMIN" && teacherInfo.teacherId !== userId) {
      throw new AppError("You can only edit your sections", 403);
    }

    const updateData: { title?: string; order?: number } = {};

    if (data.title !== undefined) {
      if (data.title.trim() === "") {
        throw new AppError("Title cannot be empty", 400);
      }
      updateData.title = data.title.trim();
    }

    if (data.order !== undefined) {
      updateData.order = data.order;
    }

    const updated = await updateSection(sectionId, updateData);

    await clearSectionCache();
    await clearCourseCache();

    return updated;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const deleteSectionService = async (
  sectionId: string,
  userId: string,
  userRole: string
) => {
  try {
    const section = await findSectionById(sectionId);

    if (!section) {
      throw new AppError("Section not found", 404);
    }

    const teacherInfo = await findCourseTeacherAndStatus(section.courseId);

    if (!teacherInfo) {
      throw new AppError("Course not found", 404);
    }

    if (userRole !== "ADMIN" && teacherInfo.teacherId !== userId) {
      throw new AppError("You can only delete your own sections", 403);
    }

    await deleteSection(sectionId);

    await clearSectionCache();
    await clearCourseCache();

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};