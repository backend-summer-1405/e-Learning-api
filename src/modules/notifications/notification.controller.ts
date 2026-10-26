import type { Request, Response, NextFunction } from "express";
import {
    getNotificationsService,
    getUnreadCountService,
    readNotificationService,
    readAllNotificationsService,
    deleteNotificationService,
    deleteAllNotificationsService,
} from "./notification.service.js";

export const getNotificationsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const result = await getNotificationsService({
            userId,
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 20),
            unreadOnly: req.query.unreadOnly as boolean | undefined,
        });

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

export const getUnreadCountController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const result = await getUnreadCountService(userId);

        res.status(200).json({

            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export const readNotificationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const notification = await readNotificationService(
            req.params.id as string,
            userId
        );
        res.status(200).json({
            success: true,
            data: notification
        });

    } catch (err) {
        next(err);
    }
};

export const readAllNotificationsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const result = await readAllNotificationsService(userId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const deleteNotificationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const result = await deleteNotificationService(
            req.params.id as string,
            userId
        );
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const deleteAllNotificationsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.userId as string;
        const result = await deleteAllNotificationsService(userId);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};