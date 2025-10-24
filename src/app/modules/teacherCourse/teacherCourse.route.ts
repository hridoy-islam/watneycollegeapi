/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { TeacherCourseControllers } from "./teacherCourse.controller";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  // auth("admin", "agent", "staff"),
  TeacherCourseControllers.getAllTeacherCourse
);
router.post(
  "/",
  auth("admin"),
  TeacherCourseControllers.TeacherCourseCreate
);
router.get(
  "/:id",
  // auth("admin", "agent", "staff"),
  TeacherCourseControllers.getSingleTeacherCourse
);

router.patch(
  "/:id",
  auth("admin"),
  TeacherCourseControllers.updateTeacherCourse
);

router.delete(
  "/:id",
  auth("admin"),
  TeacherCourseControllers.deleteTeacherCourse
);


export const TeacherCourseRoutes = router;
