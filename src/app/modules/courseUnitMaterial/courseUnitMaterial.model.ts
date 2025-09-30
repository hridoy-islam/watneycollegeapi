/* eslint-disable no-unused-vars */
import { Schema, model } from "mongoose";
import { TCourseUnitMaterial, Resource, LearningOutcomeItem } from "./courseUnitMaterial.interface";

// Sub-schema for LearningOutcomeItem
const LearningOutcomeItemSchema = new Schema<LearningOutcomeItem>({
  description: { type: String, required: true },
});

// Sub-schema for Resource
const ResourceSchema = new Schema<Resource>({
  type: {
    type: String,
    enum: ["introduction", "study-guide", "lecture", "assignment", "learning-outcome"],
    required: true,
  },
  title: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  content: { type: String },
  deadline: { type: Date },
  learningOutcomes: { type: String },
  assessmentCriteria: { type: [LearningOutcomeItemSchema], default: [] },
});

// Main schema for CourseUnitMaterial
const CourseUnitMaterialSchema = new Schema<TCourseUnitMaterial>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    unitId: { type: Schema.Types.ObjectId, ref: "CourseUnit", required: true },
    introduction: { type: ResourceSchema, },
    studyGuides: { type: [ResourceSchema], default: [] },
    lectures: { type: [ResourceSchema], default: [] },
    learningOutcomes: { type: [ResourceSchema], default: [] },
    assignments: { type: [ResourceSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const CourseUnitMaterial = model<TCourseUnitMaterial>(
  "CourseUnitMaterial",
  CourseUnitMaterialSchema
);
