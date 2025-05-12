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
exports.CommentServices = exports.updateCommentFromDB = void 0;
const task_model_1 = require("../task/task.model");
const user_model_1 = require("../user/user.model");
const comment_model_1 = require("./comment.model");
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createCommentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId, authorId, isFile } = payload;
    const task = yield task_model_1.Task.findById(taskId);
    const author = yield user_model_1.User.findById(authorId);
    if (!task || !author) {
        return null;
    }
    const commentPayload = Object.assign(Object.assign({}, payload), { seenBy: [authorId] });
    const data = yield comment_model_1.Comment.create(commentPayload);
    const users = {
        creator: task === null || task === void 0 ? void 0 : task.author,
        assigned: task === null || task === void 0 ? void 0 : task.assigned,
        authorId
    };
    const otherUser = users.creator.toString() === authorId.toString() ? users.assigned : users.creator;
    const result = Object.assign(Object.assign({}, data.toObject()), { otherUser, authorName: author.name, taskName: task.taskName });
    return result;
});
const getCommentsFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.find({ taskId: id }).populate({
        path: 'authorId',
        select: '_id name' // Select only the ID and name for the author of the comment
    });
    yield comment_model_1.Comment.updateMany({ taskId: new mongoose_1.Types.ObjectId(id) }, { $addToSet: { seenBy: user._id } } // Add the user ID to `seenBy` if not already present
    );
    return result;
});
const updateCommentFromDB = (messageId, updatedContent, requester) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the message by ID
    const message = yield comment_model_1.Comment.findById(messageId);
    if (!message) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Message not found");
    }
    // Authorization check
    if (!message.authorId.equals(new mongoose_1.Types.ObjectId(requester))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to update this message");
    }
    // Update fields
    if (updatedContent.content !== undefined) {
        message.content = updatedContent.content;
    }
    if (updatedContent.isFile !== undefined) {
        message.isFile = updatedContent.isFile;
    }
    yield message.save();
    return message;
});
exports.updateCommentFromDB = updateCommentFromDB;
exports.CommentServices = {
    createCommentIntoDB,
    getCommentsFromDB,
    updateCommentFromDB: exports.updateCommentFromDB
};
