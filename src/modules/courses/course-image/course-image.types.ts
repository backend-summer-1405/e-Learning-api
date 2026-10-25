export type CourseImageResponse = {
  id: string;
  courseId: string;
  url: string;
  isPrimary: boolean;
  order: number;
  createdAt: Date;
};