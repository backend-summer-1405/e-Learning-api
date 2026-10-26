import AppError from "../../../utils/AppError.js";
import {
  adminFindPurchases,
  adminCountPurchases,
  adminSumPurchases,
} from "./admin-purchase.repository.js";
import type {
  AdminGetPurchasesQuery,
  AdminPurchasesResult,
} from "./admin-purchase.types.js";

export const adminGetPurchasesService = async (
  query: AdminGetPurchasesQuery
): Promise<AdminPurchasesResult> => {
  try {
    const [purchases, total, summary] = await Promise.all([
      adminFindPurchases(query),
      adminCountPurchases(query),
      adminSumPurchases(query),
    ]);

    return {
      purchases,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      summary,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};