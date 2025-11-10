"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const assignment_service_1 = require("./assignment.service");
const getAllAssignment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield assignment_service_1.AssignmentServices.getAllAssignmentFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assignments retrived succesfully",
        data: result,
    });
}));
const getSingleAssignment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield assignment_service_1.AssignmentServices.getSingleAssignmentFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assignment is retrieved succesfully",
        data: result,
    });
}));
const updateAssignment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield assignment_service_1.AssignmentServices.updateAssignmentIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assignment is updated succesfully",
        data: result,
    });
}));
const createAssignment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield assignment_service_1.AssignmentServices.createAssignmentIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Assignment created successfully",
        data: result,
    });
}));
const getTeacherAssignmentFeedback = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { teacherId } = req.params;
    const query = req.query;
    const result = yield assignment_service_1.AssignmentServices.getTeacherAssignmentFeedbackFromDB(teacherId, query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher assignment feedback retrieved successfully",
        data: result,
    });
}));
const getStudentAssignmentFeedback = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    const result = yield assignment_service_1.AssignmentServices.getStudentAssignmentFeedbackFromDB(studentId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student assignments with feedback fetched successfully",
        data: result,
    });
}));
const getSubmittedAssignments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ All IDs come from query parameters
    const query = req.query;
    const { courseId, termId, unitId, assignmentId } = req.params;
    const result = yield assignment_service_1.AssignmentServices.getSubmittedAssignmentsFromDB(courseId, termId, unitId, assignmentId, query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Submitted assignments retrieved successfully",
        data: result,
    });
}));
const getFeedbackReceivedAssignments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { courseId, termId, unitId, assignmentId } = req.params;
    const result = yield assignment_service_1.AssignmentServices.getFeedbackReceivedAssignmentsFromDB(courseId, termId, unitId, assignmentId, query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assignments with feedback retrieved successfully",
        data: result,
    });
}));
const getNotSubmittedAssignments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { courseId, termId, unitId, assignmentId } = req.params;
    const result = yield assignment_service_1.AssignmentServices.getNotSubmittedAssignmentsFromDB(courseId, termId, unitId, assignmentId, query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Students who did not submit assignments retrieved successfully",
        data: result,
    });
}));
const getNoFeedbackAssignments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { courseId, termId, unitId, assignmentId } = req.params;
    const result = yield assignment_service_1.AssignmentServices.getNoFeedbackAssignmentsFromDB(courseId, termId, unitId, assignmentId, query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Students without feedback retrieved successfully",
        data: result,
    });
}));
exports.AssignmentControllers = {
    getAllAssignment,
    getSingleAssignment,
    updateAssignment,
    createAssignment,
    getTeacherAssignmentFeedback,
    getStudentAssignmentFeedback,
    getSubmittedAssignments,
    getNotSubmittedAssignments,
    getFeedbackReceivedAssignments,
    getNoFeedbackAssignments,
};
