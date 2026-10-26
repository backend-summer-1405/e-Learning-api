import fs from "node:fs/promises";
import path from "node:path";
import AppError from "../../../utils/AppError.js";
import {
    findCourseImages,
    findCourseImageById,
    createCourseImages,
    setPrimaryCourseImage,
    deleteCourseImage,
} from "./course-image.repository.js";
import { findCourseById, findCourseTeacherAndStatus } from "../course.repository.js";
import { clearCourseImageCache, clearCourseCache } from "../../../utils/cache.utils.js";

const deleteFile = async (url: string) => {
    const filePath = path.resolve(url.replace(/^\/+/, ""));
    try {
        await fs.unlink(filePath);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            console.error(`Failed to delete file ${filePath}:`, error);
        }
    }
};

export const getCourseImagesService = async (courseId: string) => {
    try {
        const course = await findCourseById(courseId);
        if (!course) throw new AppError("Course not found", 404);

        return await findCourseImages(courseId);
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};


export const addCourseImagesService = async (
    courseId: string,
    userId: string,
    userRole: string,
    urls: string[]
) => {
    try {
        const course = await findCourseById(courseId);
        if (!course) throw new AppError("Course not found", 404);

        const teacherInfo = await findCourseTeacherAndStatus(courseId);
        if (!teacherInfo) throw new AppError("Course not found", 404);

        if (userRole !== "ADMIN" && teacherInfo.teacherId !== userId) {
            throw new AppError("You can only add images to your own courses", 403);
        }

        if (!urls || urls.length === 0) {
            throw new AppError("At least one image is required", 400);
        }

        try {
            await createCourseImages(courseId, urls);
        } catch (error) {
            await Promise.allSettled(urls.map(deleteFile));
            throw error;
        }

        const addCourse = await findCourseImages(courseId);

        await clearCourseImageCache();
        await clearCourseCache();

        return addCourse;

    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const setPrimaryCourseImageService = async (
    courseId: string,
    imageId: string,
    userId: string,
    userRole: string
) => {
    try {
        const image = await findCourseImageById(imageId);

        if (!image || image.courseId !== courseId) {
            throw new AppError("Course image not found", 404);
        }

        const teacherInfo = await findCourseTeacherAndStatus(courseId);
        if (!teacherInfo) throw new AppError("Course not found", 404);

        if (userRole !== "ADMIN" && teacherInfo.teacherId !== userId) {
            throw new AppError("You can only manage your own course images", 403);
        }

        const setPrimary = await setPrimaryCourseImage(courseId, imageId);

        await clearCourseImageCache();
        await clearCourseCache();

        return setPrimary;

    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};

export const deleteCourseImageService = async (
    courseId: string,
    imageId: string,
    userId: string,
    userRole: string
) => {
    try {
        const image = await findCourseImageById(imageId);

        if (!image || image.courseId !== courseId) {
            throw new AppError("Course image not found", 404);
        }

        const teacherInfo = await findCourseTeacherAndStatus(courseId);
        if (!teacherInfo) throw new AppError("Course not found", 404);

        if (userRole !== "ADMIN" && teacherInfo.teacherId !== userId) {
            throw new AppError("You can only delete your own course images", 403);
        }

        await deleteCourseImage(imageId);
        await deleteFile(image.url);

        await clearCourseImageCache();
        await clearCourseCache();

        return { success: true };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
    }
};