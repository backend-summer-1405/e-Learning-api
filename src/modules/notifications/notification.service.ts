import { NotificationType } from "@prisma/client";
import AppError from "../../utils/AppError.js";
import {
    findNotificationsByUser,
    countNotificationsByUser,
    countUnreadNotifications,
    findNotificationById,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    createNotification,
} from "./notification.repository.js";


export const createNotificationService = async (data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
}) => {
    try {
        return await createNotification(data);
    } catch (err) {
        console.error("Failed to create notification:", err);
        return null;
    }
};

export const getNotificationsService = async (query: {
    userId: string;
    page: number;
    limit: number;
    unreadOnly?: boolean;
}) => {
    try {
        const [notifications, total] = await Promise.all([
            findNotificationsByUser(query),
            countNotificationsByUser(query),
        ]);

        return {
            notifications,
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / query.limit),
            },
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const getUnreadCountService = async (userId: string) => {
    try {
        const count = await countUnreadNotifications(userId);
        return { unreadCount: count };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const readNotificationService = async (
    id: string,
    userId: string
) => {
    try {
        const notification = await findNotificationById(id);

        if (!notification) {
            throw new AppError("Notification not found", 404);
        }

        if (notification.userId !== userId) {
            throw new AppError("You can only read your own notifications", 403);
        }

        return await markNotificationAsRead(id);
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const readAllNotificationsService = async (userId: string) => {
    try {
        await markAllAsRead(userId);
        return { success: true };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const deleteNotificationService = async (
    id: string,
    userId: string
) => {
    try {
        const notification = await findNotificationById(id);

        if (!notification) {
            throw new AppError("Notification not found", 404);
        }

        if (notification.userId !== userId) {
            throw new AppError("You can only delete your own notifications", 403);
        }

        await deleteNotification(id);
        return { success: true };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const deleteAllNotificationsService = async (userId: string) => {
    try {
        await deleteAllNotifications(userId);
        return { success: true };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};