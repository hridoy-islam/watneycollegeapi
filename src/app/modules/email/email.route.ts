/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { EmailControllers } from "./email.controller";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  // auth("admin", "agent", "staff"),
  EmailControllers.getAllEmail
);
router.post(
  "/",
  auth("admin"),
  EmailControllers.EmailCreate
);
router.get(
  "/:id",
  auth("admin"),
  EmailControllers.getSingleEmail
);

router.patch(
  "/:id",
  auth("admin"),
  EmailControllers.updateEmail
);


export const EmailRoutes = router;
