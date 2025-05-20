/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { JobControllers } from "./job.controller";

const router = express.Router();
router.get(
  "/",
  JobControllers.getAllJob
);
router.post(
  "/",
  JobControllers.createJob
);
router.get(
  "/:id",
  JobControllers.getSingleJob
);

router.patch(
  "/:id",
  JobControllers.updateJob
);


export const JobRoutes = router;
