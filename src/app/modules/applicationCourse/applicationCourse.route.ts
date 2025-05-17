/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { ApplicationCourseControllers } from "./applicationCourse.controller";

const router = express.Router();
router.get(
  "/",
  ApplicationCourseControllers.getAllApplicationCourse
);
router.post(
  "/",
  ApplicationCourseControllers.createApplicationCourse
);
router.get(
  "/:id",
  ApplicationCourseControllers.getSingleApplicationCourse
);

router.patch(
  "/:id",
  ApplicationCourseControllers.updateApplicationCourse
);


export const ApplicationCourseRoutes = router;
