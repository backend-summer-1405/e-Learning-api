import redis from "../config/redis.js";

// redis withou log 
//with scan

export const clearCache = async (pattern: string): Promise<void> => {
    try {
        let cursor = "0";
        do {
            const [newCursor, keys] = await redis.scan(
                cursor,
                "MATCH",
                pattern,
                "COUNT",
                100
            );
            cursor = newCursor;

            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } while (cursor !== "0");
    } catch (error) {
        console.error(`Failed to clear cache for pattern "${pattern}":`, error);
    }
};

export const clearCourseCache = async (): Promise<void> => {
    await clearCache("cache:/api/courses*");
    await clearCache("cache:/api/admin/courses*");
};

export const clearSectionCache = async (): Promise<void> => {
    await clearCache("cache:/api/courses/*/sections*");
};

export const clearLessonCache = async (): Promise<void> => {
    await clearCache("cache:/api/sections/*/lessons*");
};

export const clearCourseImageCache = async (): Promise<void> => {
    await clearCache("cache:/api/courses/*/images*");
};


export const clearNewsCache = async (): Promise<void> => {
    await clearCache("cache:/api/news*");
    await clearCache("cache:/api/admin/news*");
};

export const clearCommentCache = async (): Promise<void> => {
    await clearCache("cache:/api/comments*");
    await clearCache("cache:/api/admin/comments*");
};


export const clearPodcastCache = async (): Promise<void> => {
    await clearCache("cache:/api/podcasts*");
    await clearCache("cache:/api/admin/podcasts*");
};


export const clearRatingCache = async (targetType: string): Promise<void> => {
    await clearCache(`cache:/api/${targetType}/*/ratings*`);

    switch (targetType) {
        case "COURSE":
            await clearCourseCache();
            break;
        case "PODCAST":
            await clearPodcastCache();
            break;
        case "NEWS":
            await clearNewsCache();
            break;
    }
};