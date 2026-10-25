import type { CourseStatus, CourseLevel } from "@prisma/client";

export type CreateCourseInput = {
  title: string;
  description: string;
  price: number;
  level: CourseLevel;
  language?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
};

export type UpdateCourseInput = {
  title?: string;
  description?: string;
  price?: number;
  level?: CourseLevel;
  language?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
};

export type GetCoursesQuery = {
  page: number;
  limit: number;
  search?: string;
  isFree?: boolean;
  level?: CourseLevel;
  language?: string;
  sortBy?: "createdAt" | "price" | "ratingAvg" | "enrollmentCount";
  sortOrder?: "asc" | "desc";
};

export type CourseListItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  isFree: boolean;
  level: CourseLevel;
  language: string;
  thumbnailUrl: string | null;
  ratingAvg: number;
  ratingCount: number;
  enrollmentCount: number;
  teacher: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  createdAt: Date;
};

export type CoursesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetCoursesResult = {
  courses: CourseListItem[];
  pagination: CoursesPagination;
};

export type CourseDetail = CourseListItem & {
  previewVideoUrl: string | null;
  likeCount: number;
  dislikeCount: number;
  sections: {
    id: string;
    title: string;
    order: number;
    lessons: {
      id: string;
      title: string;
      duration: number;
      order: number;
      isFree: boolean;
    }[];
  }[];
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
};

export type DeleteCourseResult = {
  success: boolean;
};