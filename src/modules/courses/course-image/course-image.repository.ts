import prisma from "../../../config/prisma.js";

export const findCourseImages = async (
    courseId: string
) => {
    return prisma.courseImage.findMany({
        where: { courseId },
        orderBy: { order: "asc" },
        select: {
            id: true,
            courseId: true,
            url: true,
            isPrimary: true,
            order: true,
            createdAt: true,
        },
    });
};

export const findCourseImageById = async (
    id: string
) => {
    return prisma.courseImage.findUnique({
        where: { id },
        select: {
            id: true,
            courseId: true,
            url: true,
            isPrimary: true,
            order: true,
            createdAt: true,
        },
    });
};

export const createCourseImages = async (
    courseId: string,
    urls: string[]
) => {
    return prisma.courseImage.createMany({
        data: urls.map((url, index) => ({
            courseId,
            url,
            isPrimary: false,
            order: index,
        })),
    });
};

export const setPrimaryCourseImage = async (
    courseId: string,
    imageId: string
) => {
    await prisma.courseImage.updateMany({
        where: {
            courseId
        },
        data: {
            isPrimary: false
        },
    });

    return prisma.courseImage.update({
        where: {
            id: imageId
        },
        data: { isPrimary: true },
        select: {
            id: true,
            courseId: true,
            url: true,
            isPrimary: true,
            order: true,
            createdAt: true,
        },
    });
};

export const deleteCourseImage = async (
    id: string
) => {
    return prisma.courseImage.delete({
        where: {
            id
        }
    });
};