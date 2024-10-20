import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

import indexRoutes from "./routes/index";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import screenRoutes from "./routes/screenRoutes";

dotenv.config();
const app = express();

app.use(express.json());

connectDB();

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/screens", screenRoutes);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
