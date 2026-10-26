import type { NotificationType } from "@prisma/client";

export type CreateNotificationInput = {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
};

export type NotificationResponse = {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data: Record<string, any> | null;
    isRead: boolean;
    createdAt: Date;
};