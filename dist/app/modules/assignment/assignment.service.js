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
const getAllAssignmentFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const AssignmentQuery = new QueryBuilder_1.default(assignment_model_1.Assignment.find().populate({
        path: "studentId",
        select: "firstName title initial lastName"
    }), query)
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
exports.AssignmentServices = {
    getAllAssignmentFromDB,
    getSingleAssignmentFromDB,
    updateAssignmentIntoDB,
    createAssignmentIntoDB
};
