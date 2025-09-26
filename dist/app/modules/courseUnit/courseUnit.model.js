"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseUnit = void 0;
/* eslint-disable no-unused-vars */
const mongoose_1 = require("mongoose");
const CourseUnitSchema = new mongoose_1.Schema({
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    unitReference: { type: String },
    title: { type: String },
    level: { type: String },
    gls: { type: String },
    credit: { type: String },
});
exports.CourseUnit = (0, mongoose_1.model)("CourseUnit", CourseUnitSchema);
