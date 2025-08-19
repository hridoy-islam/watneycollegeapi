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
exports.CourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const course_constant_1 = require("./course.constant");
const course_model_1 = __importDefault(require("./course.model"));
const createCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield course_model_1.default.create(payload);
        return result;
    }
    catch (error) {
        console.error("Error in createCourseIntoDB:", error);
        // Throw the original error or wrap it with additional context
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message || "Failed to create Category");
    }
});
const getAllCourseFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const courseQuery = new QueryBuilder_1.default(course_model_1.default.find(), query)
        .search(course_constant_1.courseSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield courseQuery.countTotal();
    const result = yield courseQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.default.findById(id);
    return result;
});
const updateCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.default.findById(id);
    if (!course) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "course not found");
    }
    // Toggle `isDeleted` status for the selected user only
    // const newStatus = !user.isDeleted;
    // // Check if the user is a company, but only update the selected user
    // if (user.role === "company") {
    //   payload.isDeleted = newStatus;
    // }
    // Update only the selected user
    const result = yield course_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.CourseServices = {
    getAllCourseFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    createCourseIntoDB
};
