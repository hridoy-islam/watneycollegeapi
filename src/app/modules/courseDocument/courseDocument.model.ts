import mongoose, { Schema, Document, Types } from "mongoose";
import { TCourseDocument} from "./courseDocument.interface";

const CourseDocumentSchema = new Schema<TCourseDocument & Document>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    documents: { type: [String] },
    documentTitle: { type: String },
    
  },
  {
    timestamps: true, 
  }
);


const Course = mongoose.model<TCourseDocument & Document>(
  "CourseDocument",
  CourseDocumentSchema
);
export default Course;
