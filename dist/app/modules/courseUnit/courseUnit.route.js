"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseUnitRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const courseUnit_controller_1 = require("./courseUnit.controller");
const router = express_1.default.Router();
router.get("/", courseUnit_controller_1.CourseUnitControllers.getAllCourseUnit);
router.post("/", courseUnit_controller_1.CourseUnitControllers.createCourseUnit);
router.get("/:id", courseUnit_controller_1.CourseUnitControllers.getSingleCourseUnit);
router.patch("/:id", courseUnit_controller_1.CourseUnitControllers.updateCourseUnit);
router.delete("/:id", courseUnit_controller_1.CourseUnitControllers.deleteCourseUnit);
exports.CourseUnitRoutes = router;
