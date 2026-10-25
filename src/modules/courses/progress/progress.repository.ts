import prisma from "../../../config/prisma.js";

export const findEnrollmentByUserAndCourse = async (
    userId: string,
    courseId: string
) => {
    return prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: {
            id: true,
            userId: true,
            courseId: true,
            progress: true,
        },
    })
}

export const findLessonWithSection = async (lessonId: string) => {
    return prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
            id: true,
            title: true,
            sectionId: true,
            section: {
                select: { courseId: true },
            },
        },
    })
}

export const findLessonProgress = async (
    enrollmentId: string,
    lessonId: string
) => {
    return prisma.lessonProgress.findUnique({
        where: {
            enrollmentId_lessonId: { enrollmentId, lessonId },
        },
        select: {
            id: true,
            enrollmentId: true,
            lessonId: true,
            isCompleted: true,
            lastPosition: true,
            updatedAt: true,
        },
    });
};

export const upsertLessonProgress = async (
    enrollmentId: string,
    lessonId: string,
    data: { lastPosition: number; isCompleted: boolean }
) => {
    return prisma.lessonProgress.upsert({
        where: {
            enrollmentId_lessonId: { enrollmentId, lessonId },
        },
        update: {
            lastPosition: data.lastPosition,
            isCompleted: data.isCompleted,
        },
        create: {
            enrollmentId,
            lessonId,
            lastPosition: data.lastPosition,
            isCompleted: data.isCompleted,
        },
        select: {
            id: true,
            enrollmentId: true,
            lessonId: true,
            isCompleted: true,
            lastPosition: true,
            updatedAt: true,
        },
    });
};

export const countTotalLessons = async (courseId: string) => {
    return prisma.lesson.count({
        where: {
            section: { courseId },
        },
    })
};

export const countCompletedLessons = async (enrollmentId: string) => {
    return prisma.lessonProgress.count({
        where: {
            enrollmentId,
            isCompleted: true,
        },
    });
};



export const updateEnrollmentProgress = async (
    enrollmentId: string,
    progress: number
) => {
    return prisma.enrollment.update({
        where: { id: enrollmentId },
        data: { progress },
        select: {
            id: true,
            progress: true,
        },
    });
};

export const findAllLessonProgressByEnrollment = async (
    enrollmentId: string
) => {
    return prisma.lessonProgress.findMany({
        where: {

            enrollmentId
        },
        select: {
            lessonId: true,
            isCompleted: true,
            lastPosition: true,

            lesson: {
                select: { title: true },
            },
        },
    });
};