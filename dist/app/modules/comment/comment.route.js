"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("./comment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)("admin", "company", "creator", "user", "director"), comment_controller_1.CommentControllers.createComment);
router.get("/:id", (0, auth_1.default)("admin", "user", "director", "company", "creator"), comment_controller_1.CommentControllers.getComments);
router.patch("/:id", (0, auth_1.default)("admin", "user", "director", "company", "creator"), comment_controller_1.CommentControllers.updateComment);
exports.CommentRoutes = router;
