/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { VerifyControllers } from "./verify.controller";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  // auth("admin", "agent", "staff"),
  VerifyControllers.getAllVerify
);
router.post(
  "/",
  auth("admin","teacher"),
  VerifyControllers.VerifyCreate
);
router.get(
  "/:id",
  
  VerifyControllers.getSingleVerify
);

router.patch(
  "/:id",
  auth("admin","teacher"),
  VerifyControllers.updateVerify
);

router.delete(
  "/:id",
  auth("admin","teacher"),
  VerifyControllers.deleteVerify
);


router.get(
  "/student/:studentId",
  VerifyControllers.getStudentVerify
);



export const VerifyRoutes = router;
