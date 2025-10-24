import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import { TCourse} from "./course.interface";

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    courseCode: { type: String, required: true },
    description:{type: String},
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
   
  },
   { timestamps: true }
);

// Apply the type at the model level

const Course = mongoose.model<TCourse & Document>(
  "Course",
  courseSchema
);
export default Course;
