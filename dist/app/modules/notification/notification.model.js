"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    type: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    docId: { type: String, default: "" }
}, {
    timestamps: true,
});
exports.Notification = (0, mongoose_1.model)("notification", notificationSchema);
