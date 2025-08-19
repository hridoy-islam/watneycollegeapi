"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplication = void 0;
const mongoose_1 = require("mongoose");
const JobApplicationSchema = new mongoose_1.Schema({
    jobId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    seen: { type: Boolean, default: false }
});
exports.JobApplication = (0, mongoose_1.model)('JobApplication', JobApplicationSchema);
