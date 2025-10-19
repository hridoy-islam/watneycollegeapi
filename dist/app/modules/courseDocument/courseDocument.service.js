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
exports.CourseDocumentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const courseDocument_constant_1 = require("./courseDocument.constant");
const courseDocument_model_1 = __importDefault(require("./courseDocument.model"));
const createCourseDocumentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield courseDocument_model_1.default.create(payload);
        return result;
    }
    catch (error) {
        console.error("Error in createCourseDocumentIntoDB:", error);
        // Throw the original error or wrap it with additional context
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message || "Failed to create Category");
    }
});
const getAllCourseDocumentFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const CourseDocumentQuery = new QueryBuilder_1.default(courseDocument_model_1.default.find().populate("courseId"), query)
        .search(courseDocument_constant_1.courseDocumentSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield CourseDocumentQuery.countTotal();
    const result = yield CourseDocumentQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleCourseDocumentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseDocument_model_1.default.findById(id);
    return result;
});
const updateCourseDocumentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const courseDocument = yield courseDocument_model_1.default.findById(id);
    if (!courseDocument) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "CourseDocument not found");
    }
    const result = yield courseDocument_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteCourseDocumentIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const courseDocument = yield courseDocument_model_1.default.findById(id);
    if (!courseDocument) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "CourseDocument not found");
    }
    const result = yield courseDocument_model_1.default.findByIdAndDelete(id, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.CourseDocumentServices = {
    getAllCourseDocumentFromDB,
    getSingleCourseDocumentFromDB,
    updateCourseDocumentIntoDB,
    createCourseDocumentIntoDB,
    deleteCourseDocumentIntoDB
};
