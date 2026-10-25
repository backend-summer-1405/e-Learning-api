export type VideoAccessResult = {
  videoUrl: string;
};

export type UploadVideoResult = {
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