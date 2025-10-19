import { Types } from "mongoose";

export interface TCourseDocument {
  courseId: Types.ObjectId;
  documents:string[];
  documentTitle:string;
}