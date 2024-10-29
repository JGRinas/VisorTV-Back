import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "../src/config/db";
import authRoutes from "../src/routes/authRoutes";
import userRoutes from "../src/routes/userRoutes";
import screenRoutes from "../src/routes/screenRoutes";
import indexRoutes from "../src/routes/";

dotenv.config();
const app = express();

// Configuración de CORS
app.use(cors());

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  connectDB(); // Solo conectar a la base de datos si no estamos en test
}

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/screens", screenRoutes);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

export default app;
