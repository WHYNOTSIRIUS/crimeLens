// seting up the express app
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import userRouter from "./routes/userRoutes";
import crimeReportRouter from "./routes/crimeReportRouter";
import voteRouter from "./routes/voteRouter";
import commentRouter from "./routes/commentRouter";
import dotenv from "dotenv";
import cors from "cors";
import { json } from "body-parser";
import { urlencoded } from "express";
import cookieParser from "cookie-parser";
import { HttpError } from "http-errors";
import authRouter from "./routes/authRoutes";

// load environment variables
dotenv.config();



const app = express();

// express.json() is a middleware for the json formatting
app.use(express.json());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

//routes
//http methods are:
//GET, POST, PUT, DELETE
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

console.log("✅ app.ts: Registering auth routes at /api/auth");
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/report", crimeReportRouter);
app.use("/api/vote", voteRouter);
app.use("/api/comment", commentRouter);

// global error handler
// it should be the last middleware. otherwise, it will not catch errors
app.use(globalErrorHandler);

// 404 handler
app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  next(createError(err.status || 500, err.message));
}); 

// 500 handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});


export default app;
