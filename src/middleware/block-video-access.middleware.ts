import type { Request, Response, NextFunction } from "express";

const blockVideoAccessMiddleware = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(403).json({
    success: false,
    message:
      "Direct access to videos is forbidden. Use /api/lessons/:id/video",
  });
};

export default blockVideoAccessMiddleware;