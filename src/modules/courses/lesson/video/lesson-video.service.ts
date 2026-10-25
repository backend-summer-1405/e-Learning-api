import fs from "node:fs/promises";
import path from "node:path";
import AppError from "../../../../utils/AppError.js";
import {
  findLessonWithCourse,
  findEnrollmentForLesson,
  updateLessonVideoUrl,
  findLessonTeacherInfo,
} from "./lesson-video.repository.js";
import type {
  VideoAccessResult,
  UploadVideoResult,
} from "./lesson-video.types.js";

const deleteFile = async (url: string) => {
  const filePath = path.resolve(url.replace(/^\/+/, ""));
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Failed to delete file ${filePath}:`, error);
    }
  }
};

// ★ آپلود ویدیو (Teacher/Admin)
export const uploadLessonVideoService = async (
  lessonId: string,
  userId: string,
  userRole: string,
  videoUrl: string
): Promise<UploadVideoResult> => {
  try {
    const lesson = await findLessonTeacherInfo(lessonId);

    if (!lesson) {
      throw new AppError("Lesson not found", 404);
    }

    const teacherId = lesson.section.course.teacherId;

    if (userRole !== "ADMIN" && teacherId !== userId) {
      throw new AppError(
        "You can only upload videos to your own lessons",
        403
      );
    }

    // ★ اگه ویدیوی قبلی وجود داشت، پاکش کن
    if (lesson.videoUrl) {
      await deleteFile(lesson.videoUrl);
    }

    return await updateLessonVideoUrl(lessonId, videoUrl);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

// ★ دسترسی به ویدیو (با چک Enrollment)
export const getLessonVideoService = async (
  lessonId: string,
  userId?: string
): Promise<VideoAccessResult> => {
  try {
    const lesson = await findLessonWithCourse(lessonId);

    if (!lesson) {
      throw new AppError("Lesson not found", 404);
    }

    // ★ چک کن Course تأیید شده
    if (lesson.section.course.status !== "APPROVED") {
      throw new AppError("Course is not available", 404);
    }

    // ★ اگه Lesson رایگان → برگردون
    if (lesson.isFree) {
      return { videoUrl: lesson.videoUrl };
    }

    // ★ اگه پولی → چک Enrollment
    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const enrollment = await findEnrollmentForLesson(
      userId,
      lesson.section.courseId
    );

    if (!enrollment) {
      throw new AppError(
        "You must enroll in this course to access this video",
        403
      );
    }

    return { videoUrl: lesson.videoUrl };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};