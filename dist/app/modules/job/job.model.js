"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
/* eslint-disable no-unused-vars */
const mongoose_1 = require("mongoose");
const JobSchema = new mongoose_1.Schema({
    jobTitle: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
    jobDetail: { type: String },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1,
    },
}, {
    timestamps: true,
});
exports.Job = (0, mongoose_1.model)("Job", JobSchema);
