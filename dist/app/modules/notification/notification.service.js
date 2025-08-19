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
exports.NotificationService = exports.markAsReadIntoDB = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const notification_model_1 = require("./notification.model");
const createNotificationIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.create(payload);
    return result;
});
const getNotificationsFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    // Start building the query
    const notificationQuery = new QueryBuilder_1.default(notification_model_1.Notification.find({ userId }).populate("senderId").populate("userId"), query)
        .filter(query) // Apply filters
        .sort() // Apply sorting
        .paginate() // Apply pagination
        .fields(); // Select specific fields
    // Get total count for meta
    const meta = yield notificationQuery.countTotal();
    // Get the query result
    const result = yield notificationQuery.modelQuery;
    return {
        meta,
        result,
    };
});
// Check if a notification already exists for a user and note
const findNotification = ({ userId, noteId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query for an existing notification based on userId and noteId
        const notification = yield notification_model_1.Notification.findOne({ userId, noteId });
        return notification; // Returns null if no notification found
    }
    catch (error) {
        console.error("Error checking for existing notification:", error);
        throw new Error("Error checking for existing notification");
    }
});
const markAllAsSeen = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield notification_model_1.Notification.updateMany({
            userId,
            isRead: false
        }, {
            $set: { isRead: true }
        });
        return result;
    }
    catch (error) {
        throw new Error(`Failed to mark all notifications as read: ${error instanceof Error ? error.message : String(error)}`);
    }
});
const markAsReadIntoDB = (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.findByIdAndUpdate(notificationId, { isRead: true });
    return result;
});
exports.markAsReadIntoDB = markAsReadIntoDB;
exports.NotificationService = {
    createNotificationIntoDB,
    getNotificationsFromDB,
    markAsReadIntoDB: exports.markAsReadIntoDB,
    findNotification,
    markAllAsSeen
};
