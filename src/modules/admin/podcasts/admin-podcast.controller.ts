import type { Request, Response, NextFunction } from "express";
import {
  adminGetPodcastsService,
  adminGetPodcastDetailService,
  adminApprovePodcastService,
  adminRejectPodcastService,
  adminDeletePodcastService,
} from "./admin-podcast.service.js";

export const adminGetPodcastsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminGetPodcastsService({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 20),
      status: req.query.status as any,
      teacherId: req.query.teacherId as string | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminGetPodcastDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminGetPodcastDetailService(req.params.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminApprovePodcastController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminApprovePodcastService(req.params.id as string);
    res.status(200).json({ success: true, data: result, message: "Podcast approved" });
  } catch (error) {
    next(error);
  }
};

export const adminRejectPodcastController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminRejectPodcastService(
      req.params.id as string,
      req.body.reason
    );
    res.status(200).json({ success: true, data: result, message: "Podcast rejected" });
  } catch (error) {
    next(error);
  }
};

export const adminDeletePodcastController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminDeletePodcastService(req.params.id as string);
    res.status(200).json({ success: true, data: result, message: "Podcast deleted" });
  } catch (error) {
    next(error);
  }
};