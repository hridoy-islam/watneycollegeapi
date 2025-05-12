"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = void 0;
const zod_1 = require("zod");
const commentValidationSchema = zod_1.z.object({
    taskId: zod_1.z.string(),
    authorId: zod_1.z.string(),
    content: zod_1.z.string()
});
exports.CommentValidation = {
    commentValidationSchema,
};
