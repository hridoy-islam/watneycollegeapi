/* eslint-disable no-unused-vars */
import { Schema, model, Model, Types } from "mongoose";
import { TCourseUnit } from "./courseUnit.interface";

const CourseUnitSchema = new Schema<TCourseUnit>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  unitReference: { type: String },
  title: { type: String },
  level: { type: String },
  gls: { type: String },
  credit: { type: String },
});

export const CourseUnit: Model<TCourseUnit> = model<TCourseUnit>("CourseUnit", CourseUnitSchema);
