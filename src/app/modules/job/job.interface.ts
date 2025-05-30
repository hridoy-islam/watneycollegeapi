/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export interface TJob {
  jobTitle: string;
  applicationDeadline: Date;
  jobDetail: string
  status?: 0 | 1;
}
