import prisma from "../../../config/prisma.js";

export const findEnrollment = async (userId: string, courseId: string) => {
    return prisma.enrollment.findUnique({
        where: {
            userId_courseId: { userId, courseId },
        },
        select: {
            id: true,
            userId: true,
            courseId: true,
            progress: true,
            enrolledAt: true,
        },
    });
};

export const findEnrollmentById = async (id: string) => {
    return prisma.enrollment.findUnique({
        where: { id },
        select: {
            id: true,
            userId: true,
            courseId: true,
            progress: true,
            enrolledAt: true,
        },
    });
};

export const createEnrollment = async (
    userId: string,
    courseId: string
) => {
    return prisma.enrollment.create({
        data: {
            userId,
            courseId
        },
        select: {
            id: true,
            userId: true,
            courseId: true,
            progress: true,
            enrolledAt: true,
        },
    });
};

export const deleteEnrollment = async (id: string) => {
    return prisma.enrollment.delete({ where: { id } });
};

export const findMyEnrollments = async (userId: string) => {
    return prisma.enrollment.findMany({
        where: {
            userId
        },
        orderBy: {
            enrolledAt: "desc"
        },
        select: {
            id: true,
            userId: true,
            courseId: true,
            progress: true,
            enrolledAt: true,
            course: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    description: true,
                    thumbnailUrl: true,
                    price: true,
                    isFree: true,
                    teacher: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true
                        },
                    },
                },
            },
        },
    });
};

export const countEnrollmentsByCourse = async (courseId: string) => {
    return prisma.enrollment.count({ where: { courseId } });
};

export const incrementEnrollmentCount = async (courseId: string) => {
    return prisma.course.update({
        where: {
            id: courseId
        },
        data: {
            enrollmentCount: {
                increment: 1
            }
        },
    });
};

export const decrementEnrollmentCount = async (courseId: string) => {
    return prisma.course.update({
        where: {
            id: courseId
        },
        data: {
            enrollmentCount: {
                decrement: 1
            }
        },
    });
};

// findWalletByUserId