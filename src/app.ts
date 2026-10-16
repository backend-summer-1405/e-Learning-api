//      <=***************|====I start express project by MANI.  


import express from "express";
import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from "./modules/users/user.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import accountRouter from "./modules/accounts/account.routes.js";
import reactionRouter from "./modules/reactions/reaction.routes.js";
import newsRouter from "./modules/news/news.routes.js";

const app = express();

app.use(express.json());

// routes
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter);
app.use("/apiccount", accountRouter)
app.use('/api/reactions', reactionRouter)
app.use('/api/news', newsRouter);

////

app.use(errorMiddleware);

export default app;