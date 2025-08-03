import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// Default Route 
app.route('/', async (req, res) => {
    return res.status(200).json("Server up and running!");
})

//Route for users
app.use('/user', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))