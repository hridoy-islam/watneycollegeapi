/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { SignatureControllers } from "./signature.controller";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  // auth("admin", "agent", "staff"),
  SignatureControllers.getAllSignature
);
router.post(
  "/",
  // auth("admin", "agent", "staff"),
  SignatureControllers.SignatureCreate
);
router.get(
  "/:id",
  // auth("admin", "agent", "staff"),
  SignatureControllers.getSingleSignature
);

router.patch(
  "/:id",
  // auth("admin", "agent", "staff"),
  SignatureControllers.updateSignature
);


export const SignatureRoutes = router;
