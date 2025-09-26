/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export interface TCourseUnit {
  courseId: Types.ObjectId;
  unitReference: string;
  title: string;
  level: string;
  gls: string;
  credit: string;
}
