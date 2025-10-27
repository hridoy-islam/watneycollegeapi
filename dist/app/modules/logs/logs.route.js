"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const logs_controller_1 = require("./logs.controller");
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.get("/", 
// auth("admin", "agent", "staff"),
logs_controller_1.LogsControllers.getAllLogs);
router.post("/", 
// auth("admin"),
logs_controller_1.LogsControllers.LogsCreate);
router.get("/:id", 
// auth("admin"),
logs_controller_1.LogsControllers.getSingleLogs);
router.patch("/", 
// auth("admin"),
logs_controller_1.LogsControllers.updateLogs);
router.patch("/:id", 
// auth("admin"),
logs_controller_1.LogsControllers.updateLogsById);
exports.LogsRoutes = router;
