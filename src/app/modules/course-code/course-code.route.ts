/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { courseCodeControllers } from "./course-code.controller";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  // auth("admin", "agent", "staff"),
  courseCodeControllers.getAllcourseCode
);
router.post(
  "/",
  // auth("admin", "agent", "staff"),
  courseCodeControllers.courseCodeCreate
);
router.get(
  "/:id",
  // auth("admin", "agent", "staff"),
  courseCodeControllers.getSinglecourseCode
);

router.patch(
  "/:id",
  // auth("admin", "agent", "staff"),
  courseCodeControllers.updatecourseCode
);


export const CourseCodeRoutes = router;
