"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const email_controller_1 = require("./email.controller");
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.get("/", 
// auth("admin", "agent", "staff"),
email_controller_1.EmailControllers.getAllEmail);
router.post("/", (0, auth_1.default)("admin"), email_controller_1.EmailControllers.EmailCreate);
router.get("/:id", (0, auth_1.default)("admin"), email_controller_1.EmailControllers.getSingleEmail);
router.patch("/:id", (0, auth_1.default)("admin"), email_controller_1.EmailControllers.updateEmail);
exports.EmailRoutes = router;
