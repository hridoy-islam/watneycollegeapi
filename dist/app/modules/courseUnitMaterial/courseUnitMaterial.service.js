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
exports.CourseUnitMaterialServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const courseUnitMaterial_model_1 = require("./courseUnitMaterial.model");
const courseUnitMaterial_constant_1 = require("./courseUnitMaterial.constant");
const getAllCourseUnitMaterialFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const CourseUnitMaterialQuery = new QueryBuilder_1.default(courseUnitMaterial_model_1.CourseUnitMaterial.find(), query)
        .search(courseUnitMaterial_constant_1.CourseUnitMaterialSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield CourseUnitMaterialQuery.countTotal();
    const result = yield CourseUnitMaterialQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleCourseUnitMaterialFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseUnitMaterial_model_1.CourseUnitMaterial.findById(id);
    return result;
});
const updateCourseUnitMaterialIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const courseUnitMaterial = yield courseUnitMaterial_model_1.CourseUnitMaterial.findById(id);
    if (!courseUnitMaterial) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "CourseUnitMaterial not found");
    }
    const result = yield courseUnitMaterial_model_1.CourseUnitMaterial.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const createCourseUnitMaterialIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courseUnitMaterial_model_1.CourseUnitMaterial.create(payload);
    return result;
});
exports.CourseUnitMaterialServices = {
    getAllCourseUnitMaterialFromDB,
    getSingleCourseUnitMaterialFromDB,
    updateCourseUnitMaterialIntoDB,
    createCourseUnitMaterialIntoDB
};
