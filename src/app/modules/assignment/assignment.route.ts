/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { AssignmentControllers } from "./assignment.controller";

const router = express.Router();
router.get(
  "/",
  AssignmentControllers.getAllAssignment
);
router.post(
  "/",
  AssignmentControllers.createAssignment
);
router.get(
  "/:id",
  AssignmentControllers.getSingleAssignment
);

router.patch(
  "/:id",
  AssignmentControllers.updateAssignment
);

router.get(
  "/teacher-feedback/:teacherId",
  AssignmentControllers.getTeacherAssignmentFeedback
);

router.get(
  "/student-feedback/:studentId",
  AssignmentControllers.getStudentAssignmentFeedback
);


router.get(
  "/submitted/:courseId/:termId/:unitId/:assignmentId",
  AssignmentControllers.getSubmittedAssignments
);

router.get(
  "/with-feedback/:courseId/:termId/:unitId/:assignmentId",
  AssignmentControllers.getFeedbackReceivedAssignments
);

router.get(
  "/not-submitted/:courseId/:termId/:unitId/:assignmentId",
  AssignmentControllers.getNotSubmittedAssignments
);

router.get(
  "/no-feedback/:courseId/:termId/:unitId/:assignmentId",
  AssignmentControllers.getNoFeedbackAssignments
);

export const AssignmentRoutes = router;
