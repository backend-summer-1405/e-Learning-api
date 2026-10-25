export type CreateSectionInput = {
  title: string;
  order?: number;
};

export type UpdateSectionInput = {
  title?: string;
  order?: number;
};

export type SectionResponse = {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessonsCount?: number;
};