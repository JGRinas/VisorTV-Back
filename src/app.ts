import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import indexRoutes from "./routes/index";

dotenv.config();
const app = express();

app.use(express.json());

connectDB();

app.use("/", indexRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
