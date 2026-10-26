import { body, param, query } from "express-validator";

export const getPodcastsValidation = [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
    query("search").optional().isString().isLength({ max: 100 }),
];

export const podcastSlugValidation = [param("slug").isString().notEmpty()];

export const podcastIdValidation = [param("id").isUUID()];

export const createPodcastValidation = [
    body("title").isString().trim().notEmpty().isLength({ max: 200 }),
    body("description").isString().trim().notEmpty().isLength({ max: 5000 }),
    body("duration").isInt({ min: 0 }).toInt(),
    body("thumbnailUrl").optional().isString(),
];

export const updatePodcastValidation = [
    ...podcastIdValidation,
    body("title").optional().isString().trim().notEmpty().isLength({ max: 200 }),
    body("description")
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 5000 }),
    body("thumbnailUrl")
        .optional()
        .isString(),
];

export const trackPlayValidation = [
    ...podcastIdValidation,
    body("position")
        .isInt({ min: 0 })
        .toInt(),
];

export const saveProgressValidation = [
    ...podcastIdValidation,
    body("lastPosition")
        .isInt({ min: 0 })
        .toInt(),
];