"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const notification_controller_1 = require("./notification.controller");
const router = express_1.default.Router();
// Route to create a notification
router.post("/", (0, auth_1.default)("admin", "director", "company", "creator", "user"), notification_controller_1.NotificationControllers.createNotification);
// Route to fetch notifications for a user
router.get("/:userId", notification_controller_1.NotificationControllers.getNotifications);
// Route to mark a notification as read
router.patch("/:notificationId/read", (0, auth_1.default)("admin", "director", "company", "creator", "user"), notification_controller_1.NotificationControllers.markAsRead);
router.patch("/readall", (0, auth_1.default)("admin", "director", "company", "creator", "user"), notification_controller_1.NotificationControllers.markAllAsRead);
exports.NotificationsRoutes = router;
