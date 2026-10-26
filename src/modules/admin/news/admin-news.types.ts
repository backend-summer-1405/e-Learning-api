export type AdminGetNewsQuery = {
    page: number;
    limit: number;
    search?: string;
    sortBy?: "createdAt" | "title" | "ratingAvg";
    sortOrder?: "asc" | "desc";
}