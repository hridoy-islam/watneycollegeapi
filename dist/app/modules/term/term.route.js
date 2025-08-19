"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const term_controller_1 = require("./term.controller");
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.get("/", 
// auth("admin", "agent", "staff"),
term_controller_1.TermControllers.getAllTerm);
router.post("/", term_controller_1.TermControllers.TermCreate);
router.get("/:id", 
// auth("admin", "agent", "staff"),
term_controller_1.TermControllers.getSingleTerm);
router.patch("/:id", 
// auth("admin", "agent", "staff"),
term_controller_1.TermControllers.updateTerm);
exports.TermRoutes = router;
