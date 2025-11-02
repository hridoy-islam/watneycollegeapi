import { Types } from "mongoose";

export interface TFeedback {
  submitBy: Types.ObjectId; // teacher/admin
  comment?: string;
  files?: string[]; // feedback files
  seen?: boolean; // to check if feedback is seen by student
  deadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TSubmission {
  submitBy: Types.ObjectId; // student
  files: string[]; // multiple file uploads
  comment?: string; // optional note from student
  seen?: boolean; // to check if feedback is seen by student
  deadline?: Date;
  status?: "submitted" | "resubmitted";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TAssessmentCriteria {
  criteriaId: string; // maps with assessmentCriteria[i]._id
  description?: string;
  fulfilled?: boolean;
  comment?: string;
}

export interface TLearningOutcomeFeedback {
  learningOutcomeId: string; // maps with unitMaterial.learningOutcomes[i]._id
  learningOutcomeTitle?: string;
  assessmentCriteria?: TAssessmentCriteria[];
}

export interface TFinalFeedback {
  givenBy?: Types.ObjectId; // teacher/admin
  files?: string[];
  learningOutcomes?: TLearningOutcomeFeedback[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TAssignment {
  _id?: Types.ObjectId;
  applicationId?: Types.ObjectId; // ref to ApplicationCourse
  unitId?: Types.ObjectId; // ref to CourseUnit
  studentId: Types.ObjectId; // ref to User
  unitMaterialId?: Types.ObjectId; // ref to CourseUnitMaterial
  courseMaterialAssignmentId: string; // required
  submissions?: TSubmission[]; // Array of submission attempts
  requireResubmit?: boolean;
  feedbacks?: TFeedback[];
  finalFeedback?: TFinalFeedback;
  isFinalFeedback?: boolean;
  observationFeedback?: TFinalFeedback;
  isObservationFeedback?: boolean;
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
