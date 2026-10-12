import type { Request, Response } from "express";
import {
  createUserService,
  getMeService,
} from "./user.service.js";

export const createUserController = async (
  req: Request,
  res: Response
) => {
  const user = await createUserService(req.body);

  return res.status(201).json({
    success: true,
    data: user,
    message: "User created successfully",
  });
};



export const getMeController = async (
  req: Request,
  res: Response
) => {
  const userId = res.locals.userId as string;
  const user = await getMeService(userId);

  return res.status(200).json({
    success: true,
    data: user,
    message: "User retrieved successfully",
  });
};