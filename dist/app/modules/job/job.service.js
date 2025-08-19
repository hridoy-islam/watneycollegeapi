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
exports.JobServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const job_model_1 = require("./job.model");
const job_constant_1 = require("./job.constant");
const getAllJobFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const JobQuery = new QueryBuilder_1.default(job_model_1.Job.find(), query)
        .search(job_constant_1.JobSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield JobQuery.countTotal();
    const result = yield JobQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleJobFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.Job.findById(id);
    return result;
});
const updateJobIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield job_model_1.Job.findById(id);
    if (!job) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Job not found");
    }
    const result = yield job_model_1.Job.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const createJobIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.Job.create(payload);
    return result;
});
exports.JobServices = {
    getAllJobFromDB,
    getSingleJobFromDB,
    updateJobIntoDB,
    createJobIntoDB
};
