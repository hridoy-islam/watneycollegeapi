import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import { TTeacherCourse } from "./teacherCourse.interface";

const TeacherCourseSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true},
});

// Apply the type at the model level

const TeacherCourse = mongoose.model<TTeacherCourse & Document>(
  "TeacherCourse",
  TeacherCourseSchema
);
export default TeacherCourse;
