import { Types } from "mongoose";

export interface TcourseCode {
  course: Types.ObjectId;
  courseCode: string;
  status:0 |1;
}