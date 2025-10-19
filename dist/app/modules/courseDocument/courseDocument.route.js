"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseDocumentRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const courseDocument_controller_1 = require("./courseDocument.controller");
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.get("/", 
// auth("admin", "agent", "staff"),
courseDocument_controller_1.CourseDocumentControllers.getAllCourseDocument);
router.post("/", 
// auth("admin", "agent", "staff"),
courseDocument_controller_1.CourseDocumentControllers.CourseDocumentCreate);
router.get("/:id", 
// auth("admin", "agent", "staff"),
courseDocument_controller_1.CourseDocumentControllers.getSingleCourseDocument);
router.patch("/:id", 
// auth("admin", "agent", "staff"),
courseDocument_controller_1.CourseDocumentControllers.updateCourseDocument);
router.delete("/:id", 
// auth("admin", "agent", "staff"),
courseDocument_controller_1.CourseDocumentControllers.deleteCourseDocument);
exports.CourseDocumentRoutes = router;
