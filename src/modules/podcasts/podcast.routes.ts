import { Router } from "express";
import {
    getPodcastsController, 
    getPodcastDetailController, 
    createPodcastController,
    updatePodcastController,
     deletePodcastController, 
    trackPlayController, 
    saveProgressController,
    getProgressController,
} from "./podcast.controller.js";
import {
    getPodcastsValidation,
    podcastSlugValidation,
    podcastIdValidation,
    createPodcastValidation,
    updatePodcastValidation,
    trackPlayValidation,
    saveProgressValidation,
} from "./podcast.validation.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import teacherMiddleware from "../../middleware/teacher.middleware.js";
import optionalAuthMiddleware from "../../middleware/optional-auth.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import createUpload from "../../middleware/upload.middleware.js";
import podcastUpload from "./podcast.upload.js";

const podcastRouter = Router();



podcastRouter.get(
    "/",
    getPodcastsValidation,
    validationMiddleware,
    getPodcastsController
);

podcastRouter.get(
    "/:slug",
    podcastSlugValidation,
    validationMiddleware,
    getPodcastDetailController
);

podcastRouter.post(
    "/:id/play",
    optionalAuthMiddleware,
    trackPlayValidation,
    validationMiddleware,
    trackPlayController
)

podcastRouter.post(
    "/:id/progress",
    authMiddleware,
    saveProgressValidation,
    validationMiddleware,
    saveProgressController
)

podcastRouter.get(
    "/:id/progress",
    authMiddleware,
    podcastIdValidation,
    validationMiddleware,
    getProgressController
)

podcastRouter.post(
    "/",
    authMiddleware,
    teacherMiddleware,
    podcastUpload.single("audio"),
    createPodcastValidation,
    validationMiddleware,
    createPodcastController
)

podcastRouter.patch(
    "/:id",
    authMiddleware,
    teacherMiddleware,
    updatePodcastValidation,
    validationMiddleware,
    updatePodcastController
);

podcastRouter.delete(
    "/:id",
    authMiddleware,
    teacherMiddleware,
    podcastIdValidation,
    validationMiddleware,
    deletePodcastController
);

export default podcastRouter;