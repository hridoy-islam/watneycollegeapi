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
exports.courseCodeServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const course_code_constant_1 = require("./course-code.constant");
const course_code_model_1 = __importDefault(require("./course-code.model"));
const createcourseCodeIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield course_code_model_1.default.create(payload);
        return result;
    }
    catch (error) {
        console.error("Error in createcourseCodeIntoDB:", error);
        // Throw the original error or wrap it with additional context
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message || "Failed to create Category");
    }
});
const getAllcourseCodeFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const courseCodeQuery = new QueryBuilder_1.default(course_code_model_1.default.find().populate('course'), query)
        .search(course_code_constant_1.courseCodeSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield courseCodeQuery.countTotal();
    const result = yield courseCodeQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSinglecourseCodeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_code_model_1.default.findById(id);
    return result;
});
const updatecourseCodeIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const courseCode = yield course_code_model_1.default.findById(id);
    if (!courseCode) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "courseCode not found");
    }
    // Toggle `isDeleted` status for the selected user only
    // const newStatus = !user.isDeleted;
    // // Check if the user is a company, but only update the selected user
    // if (user.role === "company") {
    //   payload.isDeleted = newStatus;
    // }
    // Update only the selected user
    const result = yield course_code_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.courseCodeServices = {
    getAllcourseCodeFromDB,
    getSinglecourseCodeFromDB,
    updatecourseCodeIntoDB,
    createcourseCodeIntoDB
};
