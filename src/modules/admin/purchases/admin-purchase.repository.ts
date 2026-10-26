import prisma from "../../../config/prisma.js";
import type { AdminGetPurchasesQuery } from "./admin-purchase.types.js";

const buildWhere = (query: AdminGetPurchasesQuery) => {
    const where: any = {};

    if (query.userId) where.userId = query.userId;
    if (query.courseId) where.courseId = query.courseId;

    if (query.isPaid !== undefined) {
        where.course = { isFree: !query.isPaid };
    }

    if (query.fromDate || query.toDate) {
        where.enrolledAt = {};
        if (query.fromDate) where.enrolledAt.gte = new Date(query.fromDate);
        if (query.toDate) where.enrolledAt.lte = new Date(query.toDate);
    }

    return where;
};

export const adminFindPurchases = async (
    query: AdminGetPurchasesQuery


) => {
    const skip = (query.page - 1) * query.limit;
    const where = buildWhere(query);

    return prisma.enrollment.findMany({
        where,
        include: {
            user: {
                select: { id: true, name: true, email: true, avatarUrl: true },
            },
            course: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    price: true,
                    isFree: true,
                    teacher: {
                        select: { id: true, name: true },
                    },
                },
            },
        },
        orderBy: { enrolledAt: "desc" },
        skip,
        take: query.limit,
    });
};

export const adminCountPurchases = async (
    query: AdminGetPurchasesQuery
) => {
    const where = buildWhere(query);
    return prisma.enrollment.count({ where });
};

export const adminSumPurchases = async (
    query: AdminGetPurchasesQuery
) => {
    const where = buildWhere(query);


    const paidWhere = { ...where, course: { isFree: false } };

    const purchases = await prisma.enrollment.findMany({
        where: paidWhere,
        select: {
            course: {
                select: { price: true },
            },
        },
    });

    const totalAmount = purchases.reduce(
        (sum, p) => sum + (p.course?.price ?? 0),
        0
    );
    const totalCount = purchases.length;
    const avgAmount =
        totalCount > 0 ? Math.round(totalAmount / totalCount) : 0;

    return { totalAmount, totalCount, avgAmount };
};