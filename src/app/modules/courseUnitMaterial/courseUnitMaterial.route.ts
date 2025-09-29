/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { CourseUnitMaterialControllers } from "./courseUnitMaterial.controller";

const router = express.Router();
router.get(
  "/",
  CourseUnitMaterialControllers.getAllCourseUnitMaterial
);
router.post(
  "/",
  CourseUnitMaterialControllers.createCourseUnitMaterial
);
router.get(
  "/:id",
  CourseUnitMaterialControllers.getSingleCourseUnitMaterial
);

router.patch(
  "/:id",
  CourseUnitMaterialControllers.updateCourseUnitMaterial
);


export const CourseUnitMaterialRoutes = router;
