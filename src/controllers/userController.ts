import { Request, Response } from "express";
import { User } from "../models/User";

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const users = await User.find({}, "name email role")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor." });
  }
};
