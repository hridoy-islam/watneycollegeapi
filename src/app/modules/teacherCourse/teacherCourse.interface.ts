import { Types } from "mongoose";

export interface TTeacherCourse {
  couseId: Types.ObjectId;
  teacherId:Types.ObjectId;
  termId:Types.ObjectId;
  
}