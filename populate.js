import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Spot from './models/SpotModel.js';
import User from './models/UserModel.js';

try {
  await mongoose.connect(process.env.MONGO_URL);
  const user = await User.findOne({ email: 'john@gmail.com' });
  const jsonSpots = JSON.parse(
    await readFile(new URL('./utils/mockData.json', import.meta.url))
  );
  const spots = jsonSpots.map((spot) => {
    return { ...spot, createdBy: user._id };
  });
  await Spot.deleteMany({ createdBy: user._id });
  await Spot.create(spots);
  console.log('Success!!!');
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
