/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export interface TJobApplication {
  jobId: Types.ObjectId;
  applicantId: Types.ObjectId;
  seen: boolean;
}
