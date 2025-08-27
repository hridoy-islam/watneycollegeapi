/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { EmailDraftControllers } from "./email-drafts.controller";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  auth("admin"),
  EmailDraftControllers.getAllEmailDraft
);
router.post(
  "/",
  auth("admin"),
  EmailDraftControllers.EmailDraftCreate
);
router.get(
  "/:id",
  auth("admin"),
  EmailDraftControllers.getSingleEmailDraft
);

router.patch(
  "/:id",
  auth("admin"),
  EmailDraftControllers.updateEmailDraft
);


export const EmailDraftRoutes = router;
