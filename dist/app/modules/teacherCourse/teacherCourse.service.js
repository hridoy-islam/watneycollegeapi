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
exports.TeacherCourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const teacherCourse_constant_1 = require("./teacherCourse.constant");
const teacherCourse_model_1 = __importDefault(require("./teacherCourse.model"));
const createTeacherCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield teacherCourse_model_1.default.create(payload);
        return result;
    }
    catch (error) {
        console.error("Error in createTeacherCourseIntoDB:", error);
        // Throw the original error or wrap it with additional context
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message || "Failed to create Category");
    }
});
const getAllTeacherCourseFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const TeacherCourseQuery = new QueryBuilder_1.default(teacherCourse_model_1.default.find().populate('courseId').populate('termId'), query)
        .search(teacherCourse_constant_1.TeacherCourseSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield TeacherCourseQuery.countTotal();
    const result = yield TeacherCourseQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleTeacherCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield teacherCourse_model_1.default.findById(id);
    return result;
});
const updateTeacherCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherCourse = yield teacherCourse_model_1.default.findById(id);
    if (!teacherCourse) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "TeacherCourse not found");
    }
    const result = yield teacherCourse_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteTeacherCourseIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherCourse = yield teacherCourse_model_1.default.findById(id);
    if (!teacherCourse) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "TeacherCourse not found");
    }
    const result = yield teacherCourse_model_1.default.findByIdAndDelete(id, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.TeacherCourseServices = {
    getAllTeacherCourseFromDB,
    getSingleTeacherCourseFromDB,
    updateTeacherCourseIntoDB,
    createTeacherCourseIntoDB,
    deleteTeacherCourseIntoDB
};
