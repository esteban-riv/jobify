// First import environment variables from .env file
import 'express-async-errors';
import * as dotenv from 'dotenv';

dotenv.config();

// Then import express and morgan
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// Custom imports
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

//public folder
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

//midleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticatedUser } from './middleware/authMiddleware.js';

//Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});



// Then create an express app
const app = express();

// Then add dirname for public folder
const __dirname = dirname(fileURLToPath(import.meta.url));


// Then add some middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};
app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());


// Then add some routes
app.use('/api/v1/jobs', authenticatedUser, jobRouter);
app.use('/api/v1/users', authenticatedUser, userRouter);
app.use('/api/v1/auth', authRouter);

// 
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'))
});

// Then add a 404 route
app.use('*', (req, res) => {
    res.status(404).json({ message: 'no route found' });
});


app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

} catch (error) {
    console.log(error);
    process.exit(1);
}

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});