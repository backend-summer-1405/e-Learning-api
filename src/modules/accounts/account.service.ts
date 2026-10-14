import AppError from "../../utils/AppError.js";

import {
  createAccount,
  deleteAccount,
  findAccountById,
  findAccountByUsername,
  findAccountsByUserId,
  updateAccount,
} from "./account.repository.js";

export const createAccountService = async (
  userId: string,
  data: {
    username: string;
    name?: string;
  },
) => {
  const username = data.username.trim();

  if (!username) {
    throw new AppError("Username is required", 400);
  }

  const existingAccount = await findAccountByUsername(username);

  if (existingAccount) {
    throw new AppError("Username already exists", 409);
  }

  return createAccount({
    username,
    name: data.name?.trim() || undefined,
    userId,
  });
};

export const getMyAccountsService = async (userId: string) => {
  return findAccountsByUserId(userId);
};

export const getAccountByIdService = async (
  userId: string,
  accountId: string,
) => {
  const account = await findAccountById(accountId);

  if (!account || account.userId !== userId) {
    throw new AppError("Account not found", 404);
  }

  return account;
};

export const updateAccountService = async (
  userId: string,
  accountId: string,
  data: {
    username?: string;
    name?: string | null;
  },
) => {
  const account = await getAccountByIdService(userId, accountId);

  if (data.username !== undefined) {
    const username = data.username.trim();

    if (!username) {
      throw new AppError("Username cannot be empty", 400);
    }

    const existingAccount = await findAccountByUsername(username);

    if (existingAccount && existingAccount.id !== account.id) {
      throw new AppError("Username already exists", 409);
    }

    data.username = username;
  }

  if (data.name !== undefined && data.name !== null) {
    data.name = data.name.trim() || null;
  }

  return updateAccount(userId, accountId, data);
};

export const deleteAccountService = async (
  userId: string,
  accountId: string,
) => {
  try {
    return await deleteAccount(userId, accountId);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "P2025"
    ) {
      throw new AppError("Account not found", 404);
    }

    throw error;
  }
};