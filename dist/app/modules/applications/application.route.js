"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const application_controller_1 = require("./application.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)("admin", "student"), application_controller_1.ApplicationControllers.getAllApplication);
router.post("/", (0, auth_1.default)("admin", "student"), application_controller_1.ApplicationControllers.createApplication);
router.get("/:id", 
// auth("admin",   "student"),
application_controller_1.ApplicationControllers.getSingleApplication);
router.patch("/:id", (0, auth_1.default)("admin", "student"), application_controller_1.ApplicationControllers.updateApplication);
exports.ApplicationRoutes = router;
