"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailDraftRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const email_drafts_controller_1 = require("./email-drafts.controller");
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)("admin"), email_drafts_controller_1.EmailDraftControllers.getAllEmailDraft);
router.post("/", (0, auth_1.default)("admin"), email_drafts_controller_1.EmailDraftControllers.EmailDraftCreate);
router.get("/:id", (0, auth_1.default)("admin"), email_drafts_controller_1.EmailDraftControllers.getSingleEmailDraft);
router.patch("/:id", (0, auth_1.default)("admin"), email_drafts_controller_1.EmailDraftControllers.updateEmailDraft);
exports.EmailDraftRoutes = router;
