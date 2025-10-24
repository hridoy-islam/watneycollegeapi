import { Types } from "mongoose";

export interface TTeacherCourse {
  couseId: Types.ObjectId;
  teacherId:Types.ObjectId;
  
}