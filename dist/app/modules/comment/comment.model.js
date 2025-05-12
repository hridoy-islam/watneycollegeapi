"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    taskId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "task",
    },
    content: {
        type: String,
        required: true,
    },
    isFile: {
        type: Boolean,
        default: false,
    },
    authorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    seenBy: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        }]
}, {
    timestamps: true,
});
exports.Comment = (0, mongoose_1.model)("Comment", commentSchema);
