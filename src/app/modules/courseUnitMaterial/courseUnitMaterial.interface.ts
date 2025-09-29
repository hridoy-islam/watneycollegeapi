/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export type ResourceType =
  | "introduction"
  | "study-guide"
  | "lecture"
  | "assignment"
  | "learning-outcome";

export interface LearningOutcomeItem {
  parentId: Types.ObjectId;
  description: string;
}

export interface Resource {
  type: ResourceType;
  title?: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  deadline?: string;
  learningOutcomes?: string;
  assessmentCriteria?: LearningOutcomeItem[];
}

export interface TCourseUnitMaterial {
  courseId: Types.ObjectId;
  unitId: Types.ObjectId;
  introduction: Resource;
  studyGuides: Resource[];
  lectures: Resource[];
  learningOutcomes: Resource[];
  assignments:Resource[];
}
