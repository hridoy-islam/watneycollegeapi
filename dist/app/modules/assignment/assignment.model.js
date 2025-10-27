"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const mongoose_1 = require("mongoose");
const FeedbackSchema = new mongoose_1.Schema({
    submitBy: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    comment: { type: String },
    files: [{ type: String }],
    seen: { type: Boolean, default: false },
    deadline: { type: Date },
}, { timestamps: true });
const SubmissionSchema = new mongoose_1.Schema({
    submitBy: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    files: [{ type: String, required: true }],
    comment: { type: String },
    seen: { type: Boolean, default: false },
    deadline: { type: Date },
    status: {
        type: String,
        enum: ["submitted", "resubmitted"],
        default: "submitted",
    },
}, { timestamps: true });
const AssignmentSchema = new mongoose_1.Schema({
    applicationId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ApplicationCourse" },
    unitId: { type: mongoose_1.Schema.Types.ObjectId, ref: "CourseUnit" },
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    unitMaterialId: { type: mongoose_1.Schema.Types.ObjectId, ref: "CourseUnitMaterial", },
    // assignmentName: { type: String, required: true },
    courseMaterialAssignmentId: { type: String, required: true },
    // Array of submission attempts
    submissions: [SubmissionSchema],
    requireResubmit: { type: Boolean, default: false },
    feedbacks: [FeedbackSchema],
    // Current assignment status
    status: {
        type: String,
        enum: [
            "not_submitted",
            "submitted",
            "under_review",
            "feedback_given",
            "resubmission_required",
            "completed",
        ],
        default: "not_submitted",
    },
}, { timestamps: true });
exports.Assignment = (0, mongoose_1.model)("Assignment", AssignmentSchema);
