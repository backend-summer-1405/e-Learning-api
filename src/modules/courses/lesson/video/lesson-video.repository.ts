import prisma from "../../../../config/prisma.js";

export const findLessonWithCourse = async (lessonId: string) => {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      videoUrl: true,
      isFree: true,
      section: {
        select: {
          courseId: true,
          course: {
            select: {
              id: true,
              status: true,
              isFree: true,
              teacherId: true,
            },
          },
        },
      },
    },
  });
};

export const findEnrollmentForLesson = async (
  userId: string,
  courseId: string
) => {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
    select: { id: true },
  });
};

export const updateLessonVideoUrl = async (
  lessonId: string,
  videoUrl: string
) => {
  return prisma.lesson.update({
    where: { id: lessonId },
    data: { videoUrl },
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

export const findLessonTeacherInfo = async (lessonId: string) => {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      videoUrl: true,
      section: {
        select: {
          courseId: true,
          course: {
            select: {
              teacherId: true,
              status: true,
            },
          },
        },
      },
    },
  });
};