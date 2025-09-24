import bcrypt from "bcrypt";
import { Schema, Types, model } from "mongoose";
import config from "../../config";
import { TAssignment } from "./assignment.interface";

const AssignmentSchema = new Schema<TAssignment>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: "ApplicationCourse" },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignmentName:{type: String},
    document:{type:String}
  },
  {
    timestamps: true,
  }
);

export const Assignment = model<TAssignment>(
  "Assignment",
  AssignmentSchema
);