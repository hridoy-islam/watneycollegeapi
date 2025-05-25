/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { JobApplicationControllers } from "./jobApplication.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  auth("admin", "applicant"),
  JobApplicationControllers.getAllJobApplication
);
router.post(
  "/",
  auth("admin", "applicant"),
  JobApplicationControllers.createJobApplication
);
router.get(
  "/:id",
  auth("admin",   "applicant"),
  JobApplicationControllers.getSingleJobApplication
);

router.patch(
  "/:id",
  auth("admin",  "applicant"),
  JobApplicationControllers.updateJobApplication
);


export const JobApplicationRoutes = router;
