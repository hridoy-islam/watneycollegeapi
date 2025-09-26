"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const mongoose_1 = require("mongoose");
const AssignmentSchema = new mongoose_1.Schema({
    applicationId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ApplicationCourse" },
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    assignmentName: { type: String },
    document: { type: String }
}, {
    timestamps: true,
});
exports.Assignment = (0, mongoose_1.model)("Assignment", AssignmentSchema);
