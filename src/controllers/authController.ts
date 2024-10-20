import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role, name, surname } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'El correo ya está registrado.' });
      return;
    }

    if (!['admin', 'operator'].includes(role)) {
      res.status(400).json({ message: 'Rol no válido.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role,
      name,
      surname
    });

    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};
