/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export interface TAssignment {
  applicationId: Types.ObjectId;
  studentId: Types.ObjectId;
  assignmentName: String;
  document: String;

  createdAt?: Date;
  updatedAt?: Date;
}
