//      <=***************|====I start express project by MANI.  


import express from "express";
import path from "node:path";

import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from "./modules/users/user.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import accountRouter from "./modules/accounts/account.routes.js";
import reactionRouter from "./modules/reactions/reaction.routes.js";
import newsRouter from "./modules/news/news.routes.js";
import commentRouter from "./modules/comments/comment.routes.js";
import adminCommentRouter from "./modules/admin/comments/admin-comment.routes.js";
import courseRouter from "./modules/courses/course.routes.js";
import adminCourseRouter from "./modules/admin/courses/admin-course.routes.js";
import sectionRouter from "./modules/courses/section/section.routes.js";
import lessonRouter from "./modules/courses/lesson/lesson.routes.js";
import enrollmentRouter from "./modules/courses/enrollment/enrollment.routes.js";
import blockVideoAccessMiddleware from "./middleware/block-video-access.middleware.js";
import lessonVideoRouter from "./modules/courses/lesson/video/lesson-video.routes.js";
import walletRouter from "./modules/wallet/wallet.routes.js";
import adminWithdrawalRouter from "./modules/admin/withdrawals/admin-withdrawal.routes.js";
import paymentRouter from "./modules/payments/payment.routes.js";
import adminPurchaseRouter from "./modules/admin/purchases/admin-purchase.routes.js";
import ratingRouter from "./modules/ratings/rating.routes.js";
import podcastRouter from "./modules/podcasts/podcast.routes.js";
import adminPodcastRouter from "./modules/admin/podcasts/admin-podcast.routes.js";
import adminUserRouter from "./modules/admin/users/admin-user.routes.js";
import notificationRouter from "./modules/notifications/notification.routes.js";

const app = express();

app.use(express.json());

// TESTING
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");

    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


app.use("/uploads/courses/videos", blockVideoAccessMiddleware);
app.use("/uploads", express.static(path.resolve("uploads")));

// routes
app.use('/api/auth', authRouter)
app.use("/api/users", userRouter);
app.use("/api/account", accountRouter)
app.use('/api/reactions', reactionRouter)
app.use('/api/news', newsRouter);
app.use('/api/comments', commentRouter);
app.use("/api/courses", courseRouter)
app.use('/api', sectionRouter);
app.use('/api', lessonRouter);
app.use("/api", enrollmentRouter);
app.use("/api/lessons", lessonVideoRouter);
app.use("/api/wallet", walletRouter);
app.use('/api/payment', paymentRouter)
app.use("/api/ratings", ratingRouter);
app.use("/api/podcasts", podcastRouter);
app.use("/api/notifications", notificationRouter);


app.use("/api/admin/comments", adminCommentRouter);
app.use("/api/admin/courses", adminCourseRouter);
app.use("/api/admin/withdrawals", adminWithdrawalRouter);
app.use("/api/admin/purchases", adminPurchaseRouter);
app.use("/api/admin/podcasts", adminPodcastRouter);
app.use("/api/admin/users", adminUserRouter);
////
app.use(errorMiddleware);

export default app;