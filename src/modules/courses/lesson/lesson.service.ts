import AppError from "../../../utils/AppError.js";
import {
  findLessonById,
  findLessonsBySection,
  createLesson,
  updateLesson,
  deleteLesson,
  countLessonsBySection,
} from "./lesson.repository.js";
import { findSectionById } from "../section/section.repository.js";
import { findCourseTeacherAndStatus } from "../course.repository.js";
import type { CreateLessonInput, UpdateLessonInput } from "./lesson.types.js";

export const getLessonsService = async (sectionId: string) => {
  try {
    const section = await findSectionById(sectionId);

    if (!section) {
      throw new AppError("Section not found", 404);
    }

    return await findLessonsBySection(sectionId);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const createLessonService = async (
  sectionId: string,
  userId: string,
  userRole: string,
  data: CreateLessonInput
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
      throw new AppError("You can only add lessons to your own courses", 403);
    }

    let order = data.order;
    if (order === undefined) {
      order = await countLessonsBySection(sectionId);
    }

    return await createLesson({
      sectionId,
      title: data.title.trim(),
      videoUrl: data.videoUrl.trim(),
      duration: data.duration ?? 0,
      order,
      isFree: data.isFree ?? false,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const updateLessonService = async (
  lessonId: string,
  userId: string,
  userRole: string,
  data: UpdateLessonInput
) => {
  try {
    const lesson = await findLessonById(lessonId);

    if (!lesson) {
      throw new AppError("Lesson not found", 404);
    }

    const section = await findSectionById(lesson.sectionId);

    if (!section) {
      throw new AppError("Section not found", 404);
    }

    const teacherInfo = await findCourseTeacherAndStatus(section.courseId);

    if (!teacherInfo) {
      throw new AppError("Course not found", 404);
    }

    if (userRole !== "ADMIN" && teacherInfo.teacherId !== userId) {
      throw new AppError("You can only edit your own lessons", 403);
    }

    const updateData: any = {};

    if (data.title !== undefined) {
      if (data.title.trim() === "") {
        throw new AppError("Title cannot be empty", 400);
      }
      updateData.title = data.title.trim();
    }

    if (data.videoUrl !== undefined) {
      if (data.videoUrl.trim() === "") {
        throw new AppError("Video URL cannot be empty", 400);
      }
      updateData.videoUrl = data.videoUrl.trim();
    }

    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isFree !== undefined) updateData.isFree = data.isFree;

    return await updateLesson(lessonId, updateData);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const deleteLessonService = async (
  lessonId: string,
  userId: string,
  userRole: string
) => {
  try {
    const lesson = await findLessonById(lessonId);

    if (!lesson) {
      throw new AppError("Lesson not found", 404);
    }

    const section = await findSectionById(lesson.sectionId);

    if (!section) {
      throw new AppError("Section not found", 404);
    }

    const teacherInfo = await findCourseTeacherAndStatus(section.courseId);

    if (!teacherInfo) {
      throw new AppError("Course not found", 404);
    }

    if (userRole !== "ADMIN" && teacherInfo.teacherId !== userId) {
      throw new AppError("You can only delete your own lessons", 403);
    }

    await deleteLesson(lessonId);

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};