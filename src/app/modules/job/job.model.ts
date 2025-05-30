/* eslint-disable no-unused-vars */
import { Schema, model, Model } from "mongoose";
import { TJob } from "./job.interface";


const JobSchema = new Schema<TJob>(
  {
    jobTitle: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
    jobDetail:{type: String },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Job: Model<TJob> = model<TJob>("Job", JobSchema);
