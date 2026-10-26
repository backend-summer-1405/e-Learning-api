import prisma from "../../config/prisma.js";

export const findPaymentById = async (id: string) => {
    return prisma.payment.findUnique({
        where: { id },
        select: {
            id: true,
            userId: true,
            amount: true,
            authority: true,
            refId: true,
            status: true,
        },
    });
};

export const findPaymentByAuthority = async (authority: string) => {
    return prisma.payment.findUnique({
        where: {
            authority
        },
        select: {
            id: true,
            userId: true,
            amount: true,
            authority: true,
            refId: true,
            status: true,
        },
    });
};

export const updatePaymentSuccess = async (id: string, refId: string) => {
    return prisma.payment.update({
        where: {
            id
        },
        data: {
            status: "SUCCESS",
            refId
        },
    });
};

export const updatePaymentFailed = async (id: string) => {
    return prisma.payment.update({
        where: {
            id
        },
        data: {
            status: "FAILED"
        },
    });
};

export const decrementEnrollmentCount = async (courseId: string) => {
  return prisma.course.update({
    where: { id: courseId },
    data: { enrollmentCount: { decrement: 1 } },
  });
};