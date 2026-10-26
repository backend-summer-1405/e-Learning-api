export type AdminGetPodcastsQuery = {
  page: number;
  limit: number;
  status?: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  teacherId?: string;
  search?: string;
  sortBy?: "createdAt" | "playCount" | "ratingAvg";
  sortOrder?: "asc" | "desc";
};

export type PlaySegment = {
  startTime: number;   
  endTime: number;
  playCount: number;
};

export type AdminPodcastDetail = {
  podcast: any;
  stats: {
    playCount: number;
    uniqueListeners: number;
    avgRating: number;
    totalRatings: number;
    totalComments: number;
    ratingDistribution: Record<string, number>;
  };
  topSegments: PlaySegment[];      
  recentComments: any[];
  recentRatings: any[];
  recentPlays: any[];
};