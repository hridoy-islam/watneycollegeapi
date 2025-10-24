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

export const AssignmentRoutes = router;
