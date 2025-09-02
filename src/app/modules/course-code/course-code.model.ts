import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import { TcourseCode} from "./course-code.interface";

const courseCodeSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    courseCode: { type: String, required: true },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
  }
);

// Apply the type at the model level

const CourseCode = mongoose.model<TcourseCode & Document>(
  "courseCode",
  courseCodeSchema
);
export default CourseCode;
