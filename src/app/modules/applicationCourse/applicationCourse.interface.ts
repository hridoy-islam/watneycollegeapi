/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export interface TApplicationCourse {
  courseId: Types.ObjectId;
  intakeId: Types.ObjectId;
  studentId: Types.ObjectId;
  seen: boolean;
  status: string;
    createdAt?: Date;
  updatedAt?: Date;
}
