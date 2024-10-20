import { Request, Response, NextFunction } from "express";

export const isOperator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;

  if (user.role !== "operator") {
    res.status(403).json({
      message:
        "Acceso denegado. Solo los operadores pueden acceder a esta ruta.",
    });
    return;
  }

  next();
};
