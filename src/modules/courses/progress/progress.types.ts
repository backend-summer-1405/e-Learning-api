export type UpdateProgressInput = {
    lastPosition: number;
    isCompleted?: boolean;
}

export type LessonProgressResponse = {
    id: string;
    enrollmentId: string;
    lessonId: string;
    isCompleted: boolean;
    lastPosition: number;
    updatedAt: Date;
}

export type CourseProgressResponse = {
    enrollmentId: string;
    courseId: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    lessons: {
        lessonId: string;
        title: string;
        isCompleted: boolean;
        lastPosition: number;
    }[];
}

