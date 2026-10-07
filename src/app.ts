//      <=***************|====I start express project MANI.  


import express from "express";
import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from "./modules/users/ user.routes.js";
import authRouter from "./modules/auth/auth.routes.js";

const app = express();

app.use(express.json());

// routes
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter);


////

app.use(errorMiddleware);

export default app;