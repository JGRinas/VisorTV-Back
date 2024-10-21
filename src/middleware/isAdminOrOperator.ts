import { Request, Response, NextFunction } from "express";

export const isAdminOrOperator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userRole = (req as any).user.role;

  if (!userRole || (userRole !== "admin" && userRole !== "operator")) {
    res
      .status(403)
      .json({ message: "No tienes permisos para realizar esta acción." });
    return;
  }

  next();
};
