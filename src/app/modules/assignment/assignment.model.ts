import bcrypt from "bcrypt";
import { Schema, Types, model } from "mongoose";
import config from "../../config";
import { TAssignment } from "./assignment.interface";

const AssignmentSchema = new Schema<TAssignment>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: "ApplicationCourse" },
    unitId:{type: Schema.Types.ObjectId, ref: "CourseUnit"},
    studentId: { type: Schema.Types.ObjectId, ref: "User"},
    assignmentName:{type: String},
    document:{type:String},
    
  },
  {
    timestamps: true,
  }
);

export const Assignment = model<TAssignment>(
  "Assignment",
  AssignmentSchema
);