import { Request, Response, NextFunction } from "express";

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;

  if (user.role !== "admin") {
    res.status(403).json({
      message:
        "Acceso denegado. Solo los administradores pueden acceder a esta ruta.",
    });
    return;
  }

  next();
};
