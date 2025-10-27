"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const assignment_controller_1 = require("./assignment.controller");
const router = express_1.default.Router();
router.get("/", assignment_controller_1.AssignmentControllers.getAllAssignment);
router.post("/", assignment_controller_1.AssignmentControllers.createAssignment);
router.get("/:id", assignment_controller_1.AssignmentControllers.getSingleAssignment);
router.patch("/:id", assignment_controller_1.AssignmentControllers.updateAssignment);
router.get("/teacher-feedback/:teacherId", assignment_controller_1.AssignmentControllers.getTeacherAssignmentFeedback);
exports.AssignmentRoutes = router;
