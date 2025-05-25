import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TJobApplication } from './jobApplication.interface';

const JobApplicationSchema = new Schema<TJobApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId:{type: Schema.Types.ObjectId, ref: 'User', required: true },
    seen:{ type: Boolean, default: false}
  }
);

export const JobApplication = model<TJobApplication>('JobApplication', JobApplicationSchema);