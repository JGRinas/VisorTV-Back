import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const loggedInUserId = (req as any).user.id;

    const users = await User.find(
      { _id: { $ne: loggedInUserId } },
      "name surname email role"
    )
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const totalUsers = await User.countDocuments({
      _id: { $ne: loggedInUserId },
    });

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor." });
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user profile", error });
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, surname, email, role } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.name = name ?? user.name;
    user.surname = surname ?? user.surname;
    user.email = email ?? user.email;
    user.role = role ?? user.role;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await User.deleteOne({ _id: id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, surname, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res
        .status(400)
        .json({ message: "Este correo electrónico ya está registrado." });
      return;
    }

    if (!["admin", "operator"].includes(role)) {
      res.status(400).json({ message: "Rol no válido." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "Usuario creado con éxito",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};
