import bcrypt from "bcrypt";
import { Schema, Types, model } from "mongoose";
import config from "../../config";
import { TApplicationCourse } from "./applicationCourse.interface";

const ApplicationCourseSchema = new Schema<TApplicationCourse>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    intakeId: { type: Schema.Types.ObjectId, ref: "Term" },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seen: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["applied", "cancelled", "approved"],
      default: "applied",
    
    },
  },
  {
    timestamps: true,
  }
);

export const ApplicationCourse = model<TApplicationCourse>(
  "ApplicationCourse",
  ApplicationCourseSchema
);