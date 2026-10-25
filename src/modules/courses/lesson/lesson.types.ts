

export type CreateLessonInput = {
    title: string;
    videoUrl: string;
    duration?: number;
    order?: number;
    isFree?: boolean;
}

export type UpdateLessonInput = {
    title?: string;
    videoUrl?: string;
    duration?: number;
        order?: number;
    isFree?: boolean;
}



export type LessonResponse = {
    id: string;
    sectionId: string;
    title: string;
    videoUrl: string;
    duration: number;
    order: number;
    isFree: boolean;
    createdAt: Date;
    updatedAt: Date;
};