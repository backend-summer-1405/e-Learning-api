import type { Request, Response, NextFunction } from "express";
import {
  getCoursesService,
  getCourseDetailService,
  createCourseService,
  updateCourseService,
  deleteCourseService,
} from "./course.service.js";
import type { CourseLevel } from "@prisma/client";

export const getCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getCoursesService({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
      search: req.query.search as string | undefined,
      isFree: req.query.isFree as boolean | undefined,
      level: req.query.level as CourseLevel | undefined,
      language: req.query.language as string | undefined,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const course = await getCourseDetailService(slug as string);

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const createCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const teacherId = res.locals.userId as string;
    const course = await createCourseService(teacherId, req.body, "PENDING");

    res.status(201).json({
      success: true,
      data: course,
      message: "Course created successfully. Waiting for admin approval.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const userRole = res.locals.role as string;
    const { id } = req.params;

    const course = await updateCourseService(
      id as string,
      userId,
      userRole,
      req.body
    );

    res.status(200).json({
      success: true,
      data: course,
      message: "Course updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const userRole = res.locals.role as string;
    const { id } = req.params;

    const result = await deleteCourseService(id as string, userId, userRole);

    res.status(200).json({
      success: true,
      data: result,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};