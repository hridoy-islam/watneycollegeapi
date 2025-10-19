/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { CourseDocumentControllers } from "./courseDocument.controller";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  // auth("admin", "agent", "staff"),
  CourseDocumentControllers.getAllCourseDocument
);
router.post(
  "/",
  // auth("admin", "agent", "staff"),
  CourseDocumentControllers.CourseDocumentCreate
);
router.get(
  "/:id",
  // auth("admin", "agent", "staff"),
  CourseDocumentControllers.getSingleCourseDocument
);

router.patch(
  "/:id",
  // auth("admin", "agent", "staff"),
  CourseDocumentControllers.updateCourseDocument
);

router.delete(
  "/:id",
  // auth("admin", "agent", "staff"),
  CourseDocumentControllers.deleteCourseDocument
);


export const CourseDocumentRoutes = router;
