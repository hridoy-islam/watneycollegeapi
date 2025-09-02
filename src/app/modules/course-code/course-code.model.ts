import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import { TcourseCode} from "./course-code.interface";

const courseCodeSchema = new Schema(
  {
    course: { type: String,  required: true },
    courseCode: { type: String, required: true },
    
  }
);

// Apply the type at the model level

const CourseCode = mongoose.model<TcourseCode & Document>(
  "courseCode",
  courseCodeSchema
);
export default CourseCode;
