import type { CourseStatus, CourseLevel } from "@prisma/client";

export type AdminGetCoursesQuery = {
    page: number;
    limit: number;
    status?: CourseStatus;
    level?: CourseLevel;
    teacherId?: string;
    search?: string;
};
export type AdminCoursesPagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};


export type AdminGetCoursesResult = {
    courses: any[];
    pagination: AdminCoursesPagination;
};



export type AdminActionSuccess = {
    success: boolean;
};