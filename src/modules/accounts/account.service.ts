import fs from "node:fs/promises";
import path from "node:path";
import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";

import {
  createAccount,
  deleteAccount,
  findAccountById,
  findAccountByUsername,
  findAccountsByUserId,
  updateAccount,
  switchActiveAccount,
  findActiveAccount,
  clearActiveAccount,
} from "./account.repository.js";

export const createAccountService = async (
  userId: string,
  data: {
    username: string;
    name?: string;
  }
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
  const [accounts, user] = await Promise.all([
    findAccountsByUserId(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { activeAccountId: true },
    }),
  ]);

  return {
    accounts,
    activeAccountId: user?.activeAccountId ?? null,
  };
};

export const getAccountByIdService = async (
  userId: string,
  accountId: string
) => {
  const account = await findAccountById(accountId, userId);

  if (!account) {
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
  }
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

  return updateAccount(accountId, data);
};

export const deleteAccountService = async (
  userId: string,
  accountId: string
) => {
  const account = await getAccountByIdService(userId, accountId);

  const activeAccount = await findActiveAccount(userId);
  if (activeAccount?.id === accountId) {
    await clearActiveAccount(userId);
  }

  const uploadDirectory = path.resolve("uploads/accounts");

  const cleanupResults = await Promise.allSettled(
    account.images.map((image) =>
      fs.unlink(path.join(uploadDirectory, image.url))
    )
  );

  const failedDeletions = cleanupResults.filter(
    (result) => result.status === "rejected"
  );

  if (failedDeletions.length > 0) {
    console.error(
      `Failed to delete ${failedDeletions.length} account image file(s).`
    );
  }

  return await deleteAccount(accountId);
};


export const switchAccountService = async (
  userId: string,
  accountId: string
) => {
  const account = await findAccountById(accountId, userId);

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  await switchActiveAccount(userId, accountId);

  return account;
};

export const getActiveAccountService = async (userId: string) => {
  const account = await findActiveAccount(userId);

  if (!account) {
    throw new AppError("No active account", 404);
  }

  return account;
};