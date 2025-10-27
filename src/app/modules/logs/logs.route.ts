/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { LogsControllers } from "./logs.controller";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  // auth("admin", "agent", "staff"),
  LogsControllers.getAllLogs
);
router.post(
  "/",
  // auth("admin"),
  LogsControllers.LogsCreate
);
router.get(
  "/:id",
  // auth("admin"),
  LogsControllers.getSingleLogs
);

router.patch(
  "/",
  // auth("admin"),
  LogsControllers.updateLogs
);

router.patch(
  "/:id",
  // auth("admin"),
  LogsControllers.updateLogsById
);



export const LogsRoutes = router;
