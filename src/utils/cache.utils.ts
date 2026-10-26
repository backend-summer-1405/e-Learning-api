import redis from "../config/redis.js";

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