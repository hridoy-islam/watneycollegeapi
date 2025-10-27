"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherCourseRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const teacherCourse_controller_1 = require("./teacherCourse.controller");
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.get("/", 
// auth("admin", "agent", "staff"),
teacherCourse_controller_1.TeacherCourseControllers.getAllTeacherCourse);
router.post("/", (0, auth_1.default)("admin"), teacherCourse_controller_1.TeacherCourseControllers.TeacherCourseCreate);
router.get("/:id", 
// auth("admin", "agent", "staff"),
teacherCourse_controller_1.TeacherCourseControllers.getSingleTeacherCourse);
router.patch("/:id", (0, auth_1.default)("admin"), teacherCourse_controller_1.TeacherCourseControllers.updateTeacherCourse);
router.delete("/:id", (0, auth_1.default)("admin"), teacherCourse_controller_1.TeacherCourseControllers.deleteTeacherCourse);
exports.TeacherCourseRoutes = router;
