"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseUnitMaterialRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const courseUnitMaterial_controller_1 = require("./courseUnitMaterial.controller");
const router = express_1.default.Router();
router.get("/", courseUnitMaterial_controller_1.CourseUnitMaterialControllers.getAllCourseUnitMaterial);
router.post("/", courseUnitMaterial_controller_1.CourseUnitMaterialControllers.createCourseUnitMaterial);
router.get("/:id", courseUnitMaterial_controller_1.CourseUnitMaterialControllers.getSingleCourseUnitMaterial);
router.patch("/:id", courseUnitMaterial_controller_1.CourseUnitMaterialControllers.updateCourseUnitMaterial);
exports.CourseUnitMaterialRoutes = router;
