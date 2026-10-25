import type { Request, Response, NextFunction } from "express";
import {
  uploadLessonVideoService,
  getLessonVideoService,
} from "./lesson-video.service.js";
import AppError from "../../../../utils/AppError.js";

export const uploadLessonVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const userRole = res.locals.role as string;
    const { lessonId } = req.params;
    const file = req.file;

    if (!file) {
      throw new AppError("Video file is required", 400);
    }

    const videoUrl = `/uploads/courses/videos/${file.filename}`;

    const lesson = await uploadLessonVideoService(
      lessonId as string,
      userId,
      userRole,
      videoUrl
    );

    res.status(200).json({
      success: true,
      data: lesson,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getLessonVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string | undefined;
    const { lessonId } = req.params;

    const result = await getLessonVideoService(lessonId as string, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};