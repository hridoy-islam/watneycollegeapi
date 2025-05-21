/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export interface TJob {
  jobTitle: string;
  applicationDeadline: Date;
  status?: 0 | 1;
}
