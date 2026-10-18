import type { Request, Response } from "express";
import {
  createUserService,
  getMeService,
  updateMeService,
  changePasswordService,
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

///.  //////
export const updateMeController = async (
  req: Request,
  res: Response
) => {
  const userId = res.locals.userId as string;
  const avatarFile = req.file;
  const user = await updateMeService(
    userId,
    req.body,
    avatarFile
  )

  return res.status(200).json({
    success: true,
    data: user,
    message: "User updated successfully",
  });
}

////// change pass
export const changePasswordController = async (
  req: Request,
  res: Response,
) => {
  const userId = await res.locals.userId as string;
  const { currentPassword, newPassword } = req.body;
  await changePasswordService(
    userId,
    currentPassword,
    newPassword
  );

  return res.status(200).json({
    success: true,
    message: "password changed successfully"
  })

}