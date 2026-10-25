export type EnrollmentResponse = {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  enrolledAt: Date;
};

export type EnrollmentWithCourse = EnrollmentResponse & {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnailUrl: string | null;
    price: number;
    isFree: boolean;
    teacher: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
  };
};

export type EnrollResult = {
  success: boolean;
  enrollment?: EnrollmentResponse;
  message?: string;
};