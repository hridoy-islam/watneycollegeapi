"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const jobApplication_controller_1 = require("./jobApplication.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)("admin", "applicant"), jobApplication_controller_1.JobApplicationControllers.getAllJobApplication);
router.post("/", (0, auth_1.default)("admin", "applicant"), jobApplication_controller_1.JobApplicationControllers.createJobApplication);
router.get("/:id", (0, auth_1.default)("admin", "applicant"), jobApplication_controller_1.JobApplicationControllers.getSingleJobApplication);
router.patch("/:id", (0, auth_1.default)("admin", "applicant"), jobApplication_controller_1.JobApplicationControllers.updateJobApplication);
exports.JobApplicationRoutes = router;
