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
exports.AssignmentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const assignment_model_1 = require("./assignment.model");
const assignment_constant_1 = require("./assignment.constant");
const teacherCourse_model_1 = __importDefault(require("../teacherCourse/teacherCourse.model"));
const getAllAssignmentFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const AssignmentQuery = new QueryBuilder_1.default(assignment_model_1.Assignment.find().populate([
        {
            path: "studentId",
            select: "firstName title initial lastName name email",
        },
        {
            path: "submissions.submitBy",
            select: "firstName lastName name email role", // populate student details
        },
        {
            path: "feedbacks.submitBy",
            select: "firstName lastName name email role", // populate teacher/admin details
        },
        {
            path: "applicationId",
            populate: {
                path: "courseId",
                select: "name", // get only course name
            },
        },
        {
            path: "unitId",
            select: "title", // get only unit title
        },
        {
            path: "unitMaterialId",
            select: "assignments", // populate only assignments from unit material
        },
    ]), query)
        .search(assignment_constant_1.AssignmentSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield AssignmentQuery.countTotal();
    const result = yield AssignmentQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleAssignmentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield assignment_model_1.Assignment.findById(id);
    return result;
});
const updateAssignmentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = yield assignment_model_1.Assignment.findById(id);
    if (!assignment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Assignment not found");
    }
    const result = yield assignment_model_1.Assignment.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const createAssignmentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield assignment_model_1.Assignment.create(payload);
    return result;
});
const getTeacherAssignmentFeedbackFromDB = (teacherId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherCourses = yield teacherCourse_model_1.default.find({ teacherId }).select("courseId");
    if (!teacherCourses || teacherCourses.length === 0) {
        return {
            meta: { page: 1, limit: 10, total: 0, totalPage: 0 },
            result: [],
        };
    }
    const courseIds = teacherCourses.map(tc => tc.courseId);
    // Extract filters from query
    const courseIdFilter = query.courseId ? String(query.courseId) : null;
    const termIdFilter = query.termId ? String(query.termId) : null;
    // 2️⃣ Build the query for submitted assignments
    const AssignmentQuery = new QueryBuilder_1.default(assignment_model_1.Assignment.find({ status: "submitted" }).populate([
        { path: "studentId", select: "firstName title initial lastName name email" },
        { path: "submissions.submitBy", select: "firstName lastName name email role" },
        { path: "feedbacks.submitBy", select: "firstName lastName name email role" },
        {
            path: "applicationId",
            populate: { path: "courseId", select: "name" },
            match: Object.assign({ courseId: courseIdFilter ? courseIdFilter : { $in: courseIds } }, (termIdFilter && { intakeId: termIdFilter })),
        },
        { path: "unitId", select: "title" },
        { path: "unitMaterialId", select: "assignments" },
    ]), query)
        .search(assignment_constant_1.AssignmentSearchableFields)
        .filter(query)
        .sort()
        .fields()
        .paginate();
    // 3️⃣ Get all results
    const result = yield AssignmentQuery.modelQuery;
    // 4️⃣ Filter out assignments where applicationId is null
    const filteredResult = result.filter(a => a.applicationId !== null);
    // 5️⃣ Handle limit and pagination properly
    const total = filteredResult.length;
    const page = Number(query.page) || 1;
    const limitParam = query.limit === "all" ? total : Number(query.limit) || 10;
    const paginatedResult = query.limit === "all"
        ? filteredResult
        : filteredResult.slice((page - 1) * limitParam, page * limitParam);
    const totalPage = limitParam > 0 ? Math.ceil(total / limitParam) : 1;
    const meta = { page, limit: limitParam, total, totalPage };
    return { meta, result: paginatedResult };
});
exports.AssignmentServices = {
    getAllAssignmentFromDB,
    getSingleAssignmentFromDB,
    updateAssignmentIntoDB,
    createAssignmentIntoDB,
    getTeacherAssignmentFeedbackFromDB,
};
