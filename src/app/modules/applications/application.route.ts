/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { ApplicationControllers } from "./application.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  auth("admin", "student"),
  ApplicationControllers.getAllApplication
);
router.post(
  "/",
  auth("admin", "student"),
  ApplicationControllers.createApplication
);
router.get(
  "/:id",
  // auth("admin",   "student"),
  ApplicationControllers.getSingleApplication
);

router.patch(
  "/:id",
  auth("admin",  "student"),
  ApplicationControllers.updateApplication
);


export const ApplicationRoutes = router;
