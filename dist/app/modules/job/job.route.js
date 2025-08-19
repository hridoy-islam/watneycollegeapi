"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const job_controller_1 = require("./job.controller");
const router = express_1.default.Router();
router.get("/", job_controller_1.JobControllers.getAllJob);
router.post("/", job_controller_1.JobControllers.createJob);
router.get("/:id", job_controller_1.JobControllers.getSingleJob);
router.patch("/:id", job_controller_1.JobControllers.updateJob);
exports.JobRoutes = router;
