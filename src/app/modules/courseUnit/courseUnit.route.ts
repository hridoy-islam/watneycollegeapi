/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { CourseUnitControllers } from "./courseUnit.controller";

const router = express.Router();
router.get(
  "/",
  CourseUnitControllers.getAllCourseUnit
);
router.post(
  "/",
  CourseUnitControllers.createCourseUnit
);
router.get(
  "/:id",
  CourseUnitControllers.getSingleCourseUnit
);

router.patch(
  "/:id",
  CourseUnitControllers.updateCourseUnit
);


export const CourseUnitRoutes = router;
