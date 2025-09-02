"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCodeRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const course_code_controller_1 = require("./course-code.controller");
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.get("/", 
// auth("admin", "agent", "staff"),
course_code_controller_1.courseCodeControllers.getAllcourseCode);
router.post("/", 
// auth("admin", "agent", "staff"),
course_code_controller_1.courseCodeControllers.courseCodeCreate);
router.get("/:id", 
// auth("admin", "agent", "staff"),
course_code_controller_1.courseCodeControllers.getSinglecourseCode);
router.patch("/:id", 
// auth("admin", "agent", "staff"),
course_code_controller_1.courseCodeControllers.updatecourseCode);
exports.CourseCodeRoutes = router;
