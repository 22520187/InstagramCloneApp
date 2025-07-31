import express, { urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

const app = express();

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to the Instagram Clone API", success: true });
})
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:5173',
  creadentials: true,
}

app.use(cors(corsOptions));

const PORT = 8080;

app.listen(PORT , () => {
  console.log(`Server is running on port ${PORT}`);
});