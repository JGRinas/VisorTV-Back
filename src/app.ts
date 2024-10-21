import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import screenRoutes from "./routes/screenRoutes";

dotenv.config();
const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  connectDB(); // Solo conectar a la base de datos si no estamos en test
}

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/screens", screenRoutes);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

export { app };
