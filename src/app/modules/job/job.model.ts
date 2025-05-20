/* eslint-disable no-unused-vars */
import { Schema, model, Model } from 'mongoose';

export interface TJob {
  jobTitle: string;
  applicationDeadline: Date;
}

const JobSchema = new Schema<TJob>(
  {
    jobTitle: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const Job: Model<TJob> = model<TJob>(
  'Job',
  JobSchema
);
