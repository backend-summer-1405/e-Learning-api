import { Router } from "express";
import { getSectionsController, createSectionController, updateSectionController, deleteSectionController, } from "./section.controller.js";
import {
    courseIdParamValidation,
    sectionIdValidation,
    createSectionValidation,
    updateSectionValidation,
} from "./section.validation.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";
import teacherMiddleware from "../../../middleware/teacher.middleware.js";

const sectionRouter = Router();

sectionRouter.get(
    "/courses/:courseId/sections",
    courseIdParamValidation,
    validationMiddleware,
    getSectionsController
);

sectionRouter.post(
    "/courses/:courseId/sections",
    authMiddleware,
    teacherMiddleware,
    createSectionValidation,
    validationMiddleware,
    createSectionController
);

sectionRouter.patch(
    "/sections/:id",
    authMiddleware,
    teacherMiddleware,
    updateSectionValidation,
    validationMiddleware,
    updateSectionController
);

sectionRouter.delete(
    "/sections/:id",
    authMiddleware,
    teacherMiddleware,
    sectionIdValidation,
    validationMiddleware,
    deleteSectionController
);

export default sectionRouter;