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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const jobApplication_model_1 = require("./jobApplication.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendEmail_1 = require("../../utils/sendEmail");
const moment_1 = __importDefault(require("moment"));
const sendEmailAdmin_1 = require("../../utils/sendEmailAdmin");
const getAllJobApplicationFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = query, otherQueryParams = __rest(query, ["searchTerm"]);
    const processedQuery = Object.assign({}, otherQueryParams);
    const ApplicationQuery = new QueryBuilder_1.default(jobApplication_model_1.JobApplication.find().populate("jobId").populate({
        path: "applicantId",
        select: "title firstName initial lastName email phone",
    }), processedQuery)
        .filter(query)
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
const getSingleJobApplicationFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jobApplication_model_1.JobApplication.findById(id).populate("jobId");
    return result;
});
const updateJobApplicationIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield jobApplication_model_1.JobApplication.findById(id);
    if (!application) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Application not found");
    }
    const result = yield jobApplication_model_1.JobApplication.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const createJobApplicationIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!payload.jobId || !payload.applicantId) {
        throw new Error("Both jobId and applicantId are required");
    }
    // Check if application already exists for this jobId and applicantId
    const existingApplication = yield jobApplication_model_1.JobApplication.findOne({
        jobId: payload.jobId,
        applicantId: payload.applicantId
    });
    if (existingApplication) {
        throw new Error("You have already applied for this job.");
    }
    const result = yield jobApplication_model_1.JobApplication.create(payload);
    const populatedResult = yield jobApplication_model_1.JobApplication.findById(result._id)
        .populate("jobId", "jobTitle")
        .populate("applicantId", "name email availableFromDate phone dateOfBirth countryOfResidence");
    if (!populatedResult) {
        throw new Error("Failed to populate job application");
    }
    const title = (_a = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.jobId) === null || _a === void 0 ? void 0 : _a.jobTitle;
    const applicantName = (_b = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.applicantId) === null || _b === void 0 ? void 0 : _b.name;
    const applicantEmail = (_c = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.applicantId) === null || _c === void 0 ? void 0 : _c.email;
    const phone = (_d = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.applicantId) === null || _d === void 0 ? void 0 : _d.phone;
    const countryOfResidence = (_e = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.applicantId) === null || _e === void 0 ? void 0 : _e.countryOfResidence;
    const formattedCountryOfResidence = countryOfResidence
        ? countryOfResidence.charAt(0).toUpperCase() + countryOfResidence.slice(1)
        : '';
    const dob = (_f = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.applicantId) === null || _f === void 0 ? void 0 : _f.dateOfBirth;
    const formattedDob = dob ? (0, moment_1.default)(dob).format("DD MMM, YYYY") : "N/A";
    const availableFromDate = (_g = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.applicantId) === null || _g === void 0 ? void 0 : _g.availableFromDate;
    const formattedAvailableFromDate = availableFromDate ? (0, moment_1.default)(availableFromDate).format("DD MMM, YYYY") : "N/A";
    const adminSubject = `New Application Received: ${title}`;
    const emailSubject = `Thank you for applying to Watney College`;
    const otp = "";
    yield (0, sendEmail_1.sendEmail)(applicantEmail, "job-application", emailSubject, applicantName, otp, title);
    yield (0, sendEmailAdmin_1.sendEmailAdmin)("admission@watneycollege.co.uk", "job-application-admin", adminSubject, applicantName, otp, title, applicantEmail, phone, formattedCountryOfResidence, formattedDob, formattedAvailableFromDate);
    return result;
});
exports.JobApplicationServices = {
    getAllJobApplicationFromDB,
    getSingleJobApplicationFromDB,
    updateJobApplicationIntoDB,
    createJobApplicationIntoDB,
};
