//      <=***************|====I start express project by MANI.  


import express from "express";
import path from "node:path";

import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from "./modules/users/user.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import accountRouter from "./modules/accounts/account.routes.js";
import reactionRouter from "./modules/reactions/reaction.routes.js";
import newsRouter from "./modules/news/news.routes.js";

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

// routes
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter);
app.use("/api/account", accountRouter)
app.use('/api/reactions', reactionRouter)
app.use('/api/news', newsRouter);

////

app.use(errorMiddleware);

export default app;