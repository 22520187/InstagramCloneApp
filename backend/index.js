import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to the Instagram Clone API", success: true });
})
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
}

app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);


app.listen(PORT , () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});