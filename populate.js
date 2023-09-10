import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Job from './models/JobModel.js';
import User from './models/UserModel.js';

try {
    await mongoose.connect(process.env.MONGO_URL);
    const user = await User.findOne({ email: 'estebanriveraseco@gmail.com' });
    const jsonJobs = JSON.parse(
        await readFile(new URL('./utils/mockData.json', import.meta.url))
    );
    const jobs = jsonJobs.map((job) => ({ ...job, createdBy: user._id }));
    await Job.deleteMany({ createdBy: user._id });
    await Job.create(jobs);
    console.log('Data imported');
    process.exit(0);
} catch (error) {
    console.error(error);
    process.exit(1);
}