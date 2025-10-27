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
exports.ApplicationCourseControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const applicationCourse_service_1 = require("./applicationCourse.service");
const getAllApplicationCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield applicationCourse_service_1.ApplicationCourseServices.getAllApplicationCourseFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ApplicationCourses retrived succesfully",
        data: result,
    });
}));
const getSingleApplicationCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield applicationCourse_service_1.ApplicationCourseServices.getSingleApplicationCourseFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ApplicationCourse is retrieved succesfully",
        data: result,
    });
}));
const updateApplicationCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield applicationCourse_service_1.ApplicationCourseServices.updateApplicationCourseIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ApplicationCourse is updated succesfully",
        data: result,
    });
}));
const createApplicationCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield applicationCourse_service_1.ApplicationCourseServices.createApplicationCourseIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "ApplicationCourse created successfully",
        data: result,
    });
}));
const getAllTeacherStudentApplications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherId = req.params.id;
    const result = yield applicationCourse_service_1.ApplicationCourseServices.getAllTeacherStudentApplicationsFromDb(teacherId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ApplicationCourse applications retrieved successfully",
        data: result,
    });
}));
exports.ApplicationCourseControllers = {
    getAllApplicationCourse,
    getSingleApplicationCourse,
    updateApplicationCourse,
    createApplicationCourse,
    getAllTeacherStudentApplications
};
