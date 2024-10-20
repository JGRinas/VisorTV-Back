import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import routes from './routes';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use('/api', routes);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
