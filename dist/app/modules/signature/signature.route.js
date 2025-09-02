"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const signature_controller_1 = require("./signature.controller");
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.get("/", 
// auth("admin", "agent", "staff"),
signature_controller_1.SignatureControllers.getAllSignature);
router.post("/", 
// auth("admin", "agent", "staff"),
signature_controller_1.SignatureControllers.SignatureCreate);
router.get("/:id", 
// auth("admin", "agent", "staff"),
signature_controller_1.SignatureControllers.getSingleSignature);
router.patch("/:id", 
// auth("admin", "agent", "staff"),
signature_controller_1.SignatureControllers.updateSignature);
exports.SignatureRoutes = router;
