import type { Role } from "@prisma/client";

export type AdminGetUsersQuery = {
  page: number;
  limit: number;
  role?: Role;
  search?: string;
  sortBy?: "createdAt" | "name" | "email";
  sortOrder?: "asc" | "desc";
};

export type AdminUpdateUserInput = {
  name?: string;
  role?: Role;
};

export type AdminUsersResult = {
  users: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};