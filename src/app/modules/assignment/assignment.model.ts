import { Schema, model, Types } from "mongoose";
import { TAssignment } from "./assignment.interface";

const FeedbackSchema = new Schema(
  {
    submitBy: { type: Types.ObjectId, ref: "User", required: true }, // teacher/admin
    comment: { type: String },
    files: [{ type: String }], // feedback files
    seen: { type: Boolean, default: false }, // to check if feedback is seen by student
    deadline: { type: Date },
  },
  { timestamps: true }
);

const SubmissionSchema = new Schema(
  {
    submitBy: { type: Types.ObjectId, ref: "User", required: true }, // student
    files: [{ type: String, required: true }], // multiple file uploads
    comment: { type: String }, // optional note from student
    seen: { type: Boolean, default: false }, // to check if feedback is seen by student
    deadline: { type: Date },

    status: {
      type: String,
      enum: ["submitted", "resubmitted"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

const AssignmentSchema = new Schema<TAssignment>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: "ApplicationCourse" },
    unitId: { type: Schema.Types.ObjectId, ref: "CourseUnit" },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    unitMaterialId: { type: Schema.Types.ObjectId, ref: "CourseUnitMaterial",  },
    // assignmentName: { type: String, required: true },
    courseMaterialAssignmentId:{ type: String, required: true },
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
  },
  { timestamps: true }
);

export const Assignment = model<TAssignment>("Assignment", AssignmentSchema);
