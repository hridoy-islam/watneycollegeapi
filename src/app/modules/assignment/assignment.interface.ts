/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export interface TFeedback {
  submitBy: Types.ObjectId; // Teacher/Admin who gave feedback
  comment?: string;
  files?: string[]; // Feedback files (optional)
  requireResubmit?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TSubmission {
  submitBy: Types.ObjectId; // Student who submitted
  files: string[]; // Submitted files (can be multiple)
  comment?: string; // Optional note from student
  status?: "submitted" | "resubmitted";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TAssignment {
  applicationId?: Types.ObjectId;
  unitId?: Types.ObjectId;
  studentId: Types.ObjectId;
  assignmentName: string;
  unitMaterialId:Types.ObjectId;
  courseMaterialAssignmentId: string;
  submissions?: TSubmission[]; // All student submission attempts
  feedbacks?: TFeedback[]; // All teacher/admin feedback entries
  requireResubmit: boolean;
  status?:
    | "not_submitted"
    | "submitted"
    | "under_review"
    | "feedback_given"
    | "resubmission_required"
    | "completed";

  createdAt?: Date;
  updatedAt?: Date;
}
