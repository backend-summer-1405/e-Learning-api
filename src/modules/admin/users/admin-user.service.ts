import AppError from "../../../utils/AppError.js";
import {
  adminFindUsers,
  adminCountUsers,
  adminFindUserById,
  adminUpdateUser,
  adminDeleteUser,
  adminGetUserStats,
} from "./admin-user.repository.js";
import type {
  AdminGetUsersQuery,
  AdminUpdateUserInput,
  AdminUsersResult,
} from "./admin-user.types.js";

export const adminGetUsersService = async (
  query: AdminGetUsersQuery
): Promise<AdminUsersResult> => {
  try {
    const [users, total] = await Promise.all([
      adminFindUsers(query),
      adminCountUsers(query),
    ]);

    return {
      users,
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

export const adminGetUserByIdService = async (id: string) => {
  try {
    const user = await adminFindUserById(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminUpdateUserService = async (
  id: string,
  data: AdminUpdateUserInput
) => {
  try {
    const user = await adminFindUserById(id);
    if (!user) throw new AppError("User not found", 404);

    return await adminUpdateUser(id, data);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminDeleteUserService = async (
  id: string,
  currentUserId: string
) => {
  try {
    if (id === currentUserId) {
      throw new AppError("You cannot delete yourself", 400);
    }

    const user = await adminFindUserById(id);
    if (!user) throw new AppError("User not found", 404);

    await adminDeleteUser(id);
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminGetUserStatsService = async () => {
  try {
    return await adminGetUserStats();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};