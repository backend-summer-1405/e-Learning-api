import type { WithdrawalStatus } from "@prisma/client";

export type AdminGetWithdrawalsQuery = {
  page: number;
  limit: number;
  status?: WithdrawalStatus;
  userId?: string;
};