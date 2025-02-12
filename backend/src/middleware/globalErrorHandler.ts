import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err);

  if (createHttpError.isHttpError(err)) {
    res.status(err.status).json({
      message: err.message
    });
    next();
  } else {
    res.status(500).json({
      message: "Internal Server Error"
    });
    next();
  }
}; 