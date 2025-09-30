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
exports.CourseUnitServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const courseUnit_model_1 = require("./courseUnit.model");
const courseUnit_constant_1 = require("./courseUnit.constant");
const courseUnitMaterial_model_1 = require("../courseUnitMaterial/courseUnitMaterial.model");
const getAllCourseUnitFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const CourseUnitQuery = new QueryBuilder_1.default(courseUnit_model_1.CourseUnit.find().populate({
        path: "courseId",
        select: "name",
    }), query)
        .search(courseUnit_constant_1.CourseUnitSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield CourseUnitQuery.countTotal();
    const result = yield CourseUnitQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleCourseUnitFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseUnit_model_1.CourseUnit.findById(id).populate({
        path: "courseId",
        select: "name",
    });
    return result;
});
const updateCourseUnitIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const courseUnit = yield courseUnit_model_1.CourseUnit.findById(id);
    if (!courseUnit) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "CourseUnit not found");
    }
    const result = yield courseUnit_model_1.CourseUnit.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const createCourseUnitIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseUnit_model_1.CourseUnit.create(payload);
    return result;
});
const deleteCourseUnitIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const courseUnit = yield courseUnit_model_1.CourseUnit.findById(id);
    if (!courseUnit) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "CourseUnit not found");
    }
    yield courseUnitMaterial_model_1.CourseUnitMaterial.deleteMany({ unitId: id });
    // Delete the course unit itself
    const result = yield courseUnit_model_1.CourseUnit.findByIdAndDelete(id);
    return result;
});
exports.CourseUnitServices = {
    getAllCourseUnitFromDB,
    getSingleCourseUnitFromDB,
    updateCourseUnitIntoDB,
    createCourseUnitIntoDB,
    deleteCourseUnitIntoDB
};
