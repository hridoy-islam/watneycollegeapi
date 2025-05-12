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
exports.ApplicationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const application_constant_1 = require("./application.constant");
const application_model_1 = require("./application.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const getAllApplicationFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const ApplicationQuery = new QueryBuilder_1.default(application_model_1.Application.find(), query)
        .search(application_constant_1.ApplicationSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield ApplicationQuery.countTotal();
    const result = yield ApplicationQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleApplicationFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield application_model_1.Application.findById(id);
    return result;
});
const updateApplicationIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield application_model_1.Application.findById(id);
    if (!application) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Application not found");
    }
    const result = yield application_model_1.Application.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const createApplicationIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield application_model_1.Application.create(payload);
    return result;
});
exports.ApplicationServices = {
    getAllApplicationFromDB,
    getSingleApplicationFromDB,
    updateApplicationIntoDB,
    createApplicationIntoDB
};
