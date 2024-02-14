import mongoose from 'mongoose';
import { SPOT_STATUS, SPOT_TYPE } from '../utils/constants.js';
const SpotSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    spotStatus: {
      type: String,
      enum: Object.values(SPOT_STATUS),
      default: SPOT_STATUS.PENDING,
    },
    spotType: {
      type: String,
      enum: Object.values(SPOT_TYPE),
      default: SPOT_TYPE.FULL_TIME,
    },
    spotLocation: {
      type: String,
      default: 'my city',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Spot', SpotSchema);
