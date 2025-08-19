"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationCourseRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const applicationCourse_controller_1 = require("./applicationCourse.controller");
const router = express_1.default.Router();
router.get("/", applicationCourse_controller_1.ApplicationCourseControllers.getAllApplicationCourse);
router.post("/", applicationCourse_controller_1.ApplicationCourseControllers.createApplicationCourse);
router.get("/:id", applicationCourse_controller_1.ApplicationCourseControllers.getSingleApplicationCourse);
router.patch("/:id", applicationCourse_controller_1.ApplicationCourseControllers.updateApplicationCourse);
exports.ApplicationCourseRoutes = router;
