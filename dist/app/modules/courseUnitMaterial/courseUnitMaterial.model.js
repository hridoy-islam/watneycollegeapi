"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseUnitMaterial = void 0;
/* eslint-disable no-unused-vars */
const mongoose_1 = require("mongoose");
// Sub-schema for LearningOutcomeItem
const LearningOutcomeItemSchema = new mongoose_1.Schema({
    description: { type: String, required: true },
});
// Sub-schema for Resource
const ResourceSchema = new mongoose_1.Schema({
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
    finalFeedback: { type: Boolean, default: false },
    observation: { type: Boolean, default: false },
    assessmentCriteria: { type: [LearningOutcomeItemSchema], default: [] },
});
// Main schema for CourseUnitMaterial
const CourseUnitMaterialSchema = new mongoose_1.Schema({
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    unitId: { type: mongoose_1.Schema.Types.ObjectId, ref: "CourseUnit", required: true },
    introduction: { type: ResourceSchema, },
    studyGuides: { type: [ResourceSchema], default: [] },
    lectures: { type: [ResourceSchema], default: [] },
    learningOutcomes: { type: [ResourceSchema], default: [] },
    assignments: { type: [ResourceSchema], default: [] },
}, {
    timestamps: true,
});
exports.CourseUnitMaterial = (0, mongoose_1.model)("CourseUnitMaterial", CourseUnitMaterialSchema);
