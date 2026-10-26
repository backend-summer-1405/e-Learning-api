export type AdminGetPurchasesQuery = {
  page: number;
  limit: number;
  userId?: string;
  courseId?: string;
  isPaid?: boolean;
  fromDate?: string;
  toDate?: string;
};

export type AdminPurchasesResult = {
  purchases: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalAmount: number;
    totalCount: number;
  };
};