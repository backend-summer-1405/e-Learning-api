import AppError from "../../../utils/AppError.js";
import {
  findEnrollmentByUserAndCourse,
  findLessonWithSection,
  findLessonProgress,
  upsertLessonProgress,
  countTotalLessons,
  countCompletedLessons,
  updateEnrollmentProgress,
  findAllLessonProgressByEnrollment,
} from "./progress.repository.js";
import type {
  UpdateProgressInput,
  CourseProgressResponse,
} from "./progress.types.js";

export const updateProgressService = async (
  userId: string,
  lessonId: string,
  data: UpdateProgressInput
) => {
  try {
    const lesson = await findLessonWithSection(lessonId);
    if (!lesson) throw new AppError("Lesson not found", 404);

    const courseId = lesson.section.courseId;

    const enrollment = await findEnrollmentByUserAndCourse(userId, courseId);
    if (!enrollment) {
      throw new AppError(
        "You must enroll in this course to track progress",
        403
      );
    }

    const existing = await findLessonProgress(enrollment.id, lessonId);
    const isCompleted = data.isCompleted ?? existing?.isCompleted ?? false;

    const progress = await upsertLessonProgress(enrollment.id, lessonId, {
      lastPosition: data.lastPosition,
      isCompleted,
    });

    const [total, completed] = await Promise.all([
      countTotalLessons(courseId),
      countCompletedLessons(enrollment.id),
    ]);

    const courseProgress =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    await updateEnrollmentProgress(enrollment.id, courseProgress);

    return progress;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const getLessonProgressService = async (
  userId: string,
  lessonId: string
) => {
  try {
    const lesson = await findLessonWithSection(lessonId);
    if (!lesson) throw new AppError("Lesson not found", 404);

    const enrollment = await findEnrollmentByUserAndCourse(
      userId,
      lesson.section.courseId
    );

    if (!enrollment) {
      throw new AppError("You are not enrolled in this course", 403);
    }

    const progress = await findLessonProgress(enrollment.id, lessonId);

    if (!progress) {
      return {
        lessonId,
        isCompleted: false,
        lastPosition: 0,
      };
    }

    return progress;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const getCourseProgressService = async (
  userId: string,
  courseId: string
): Promise<CourseProgressResponse> => {
  try {
    const enrollment = await findEnrollmentByUserAndCourse(userId, courseId);

    if (!enrollment) {
      throw new AppError("You are not enrolled in this course", 403);
    }

    const [total, completed, lessons] = await Promise.all([
      countTotalLessons(courseId),
      countCompletedLessons(enrollment.id),
      findAllLessonProgressByEnrollment(enrollment.id),
    ]);

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      enrollmentId: enrollment.id,
      courseId,
      progress,
      totalLessons: total,
      completedLessons: completed,
      lessons: lessons.map((l) => ({
        lessonId: l.lessonId,
        title: l.lesson.title,
        isCompleted: l.isCompleted,
        lastPosition: l.lastPosition,
      })),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};