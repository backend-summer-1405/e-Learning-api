import prisma from "../../config/prisma.js";
import type { NotificationType } from "@prisma/client";
import type { CreateNotificationInput } from "./notification.types.js";

const notificationSelect = {
    id: true,
    userId: true,
    type: true,
    title: true,
    message: true,
    data: true,
    isRead: true,
    createdAt: true,
};

export const createNotification = async (data: CreateNotificationInput) => {
    return prisma.notification.create({
        data: {
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            data: data.data ?? undefined,
        },
        select: notificationSelect,
    });
};

export const findNotificationsByUser = async (query: {
    userId: string;
    page: number;
    limit: number;
    unreadOnly?: boolean;
}) => {
    const skip = (query.page - 1) * query.limit;

    return prisma.notification.findMany({
        where: {
            userId: query.userId,
            ...(query.unreadOnly ? { isRead: false } : {}),
        },
        select: notificationSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: query.limit,
    });
};

export const countNotificationsByUser = async (query: {
    userId: string;
    unreadOnly?: boolean;
}) => {
    return prisma.notification.count({
        where: {
            userId: query.userId,
            ...(query.unreadOnly ? { isRead: false } : {}),
        },
    });
};

export const countUnreadNotifications = async (
    userId: string
) => {


    return prisma.notification.count({
        where: {
            userId,
            isRead: false
        },
    });
};

export const findNotificationById = async (id: string) => {
    return prisma.notification.findUnique({
        where: {
            id
        },
        select: notificationSelect,
    });
};

export const markNotificationAsRead = async (id: string) => {
    return prisma.notification.update({
        where: { id },
        data: {
            isRead: true
        },
        select: notificationSelect,
    });
};

export const markAllAsRead = async (userId: string) => {
    return prisma.notification.updateMany({
        where: {
            userId,
            isRead: false
        },
        data: {
            isRead: true
        },
    });
};

export const deleteNotification = async (id: string) => {
    return prisma.notification.delete({
        where: {
            id
        }
    });
};

export const deleteAllNotifications = async (userId: string) => {
    return prisma.notification.deleteMany({
        where: {
            userId
        }
    });
};