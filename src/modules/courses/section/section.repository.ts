import prisma from "../../../config/prisma.js";

export const findSectionById = async (id: string) => {
    return prisma.section.findUnique({
        where: { id },
        select: {
            id: true,
            courseId: true,
            title: true,
            order: true,
            _count: { select: { lessons: true } },
        },
    });
};

export const findSectionsByCourse = async (courseId: string) => {
    return prisma.section.findMany({
        where: { courseId },
        orderBy: {
            order: "asc"

        },
        select: {
            id: true,
            courseId: true,
            title: true,
            order: true,
            _count: { select: { lessons: true } },
        },
    });
};

export const createSection = async (data: {
    courseId: string;
    title: string;
    order: number;
}) => {
    return prisma.section.create({
        data,
        select: {
            id: true,
            courseId: true,
            title: true,
            order: true,
        },
    });
};

export const updateSection = async (
    id: string,
    data: { title?: string; order?: number }
) => {
    return prisma.section.update({
        where: {
            id
        },
        data,
        select: {
            id: true,
            courseId: true,
            title: true,
            order: true,
        },
    });
};

export const deleteSection = async (
    id: string
) => {
    return prisma.section.delete({
        where: {

            id,
        }
    });
};

export const countSectionsByCourse = async (
    courseId: string
) => {
    return prisma.section.count({ where: { courseId } });
};