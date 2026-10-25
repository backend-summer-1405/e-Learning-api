import type { Request, Response, NextFunction } from "express";
import {
  getLessonsService,
  createLessonService,
  updateLessonService,
  deleteLessonService,
} from "./lesson.service.js";

export const getLessonsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sectionId } = req.params;
    const lessons = await getLessonsService(sectionId as string);

    res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    next(error);
  }
};

export const createLessonController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const userRole = res.locals.role as string;
    const { sectionId } = req.params;

    const lesson = await createLessonService(
      sectionId as string,
      userId,
      userRole,
      req.body
    );

    res.status(201).json({
      success: true,
      data: lesson,
      message: "Lesson created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateLessonController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const userRole = res.locals.role as string;
    const { id } = req.params;

    const lesson = await updateLessonService(
      id as string,
      userId,
      userRole,
      req.body
    );

    res.status(200).json({
      success: true,
      data: lesson,
      message: "Lesson updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLessonController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const userRole = res.locals.role as string;
    const { id } = req.params;

    const result = await deleteLessonService(id as string, userId, userRole);

    res.status(200).json({
      success: true,
      data: result,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};