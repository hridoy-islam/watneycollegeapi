"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationCourse = void 0;
const mongoose_1 = require("mongoose");
const ApplicationCourseSchema = new mongoose_1.Schema({
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course" },
    intakeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Term" },
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    seen: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["applied", "cancelled", "approved"],
        default: "applied",
    },
}, {
    timestamps: true,
});
exports.ApplicationCourse = (0, mongoose_1.model)("ApplicationCourse", ApplicationCourseSchema);
