import type { Request, Response, NextFunction } from "express";
import {
  getPodcastsService,
  getPodcastDetailService,
  createPodcastService,
  updatePodcastService,
  deletePodcastService,
  trackPlayService,
  saveProgressService,
  getProgressService,
} from "./podcast.service.js";
import AppError from "../../utils/AppError.js";

export const getPodcastsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getPodcastsService({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
      search: req.query.search as string | undefined,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getPodcastDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const podcast = await getPodcastDetailService(req.params.slug as string);
    res.status(200).json({ success: true, data: podcast });
  } catch (error) {
    next(error);
  }
};

export const createPodcastController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const userRole = res.locals.role as string;
    const file = req.file;

    if (!file) throw new AppError("Audio file is required", 400);

    const audioUrl = `/uploads/podcasts/${file.filename}`;
    const audioFilePath = file.path;

    const podcast = await createPodcastService(
      userId,
      userRole,
      { ...req.body, audioUrl },
      audioFilePath
    );

    res.status(201).json({
      success: true,
      data: podcast,
      message: "Podcast created",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePodcastController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const userRole = res.locals.role as string;
    const podcast = await updatePodcastService(
      req.params.id as string,
      userId,
      userRole,
      req.body
    );
    res.status(200).json({ success: true, data: podcast });
  } catch (error) {
    next(error);
  }
};

export const deletePodcastController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const userRole = res.locals.role as string;
    const result = await deletePodcastService(
      req.params.id as string,
      userId,
      userRole
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const trackPlayController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string | undefined;
    const result = await trackPlayService(
      req.params.id as string,
      userId,
      req.body.position
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const saveProgressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const progress = await saveProgressService(
      userId,
      req.params.id as string,
      req.body.lastPosition
    );
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

export const getProgressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const progress = await getProgressService(
      userId,
      req.params.id as string
    );
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};