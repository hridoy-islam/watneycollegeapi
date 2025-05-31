"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadDocumentRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const multer_1 = require("../../utils/multer");
const documents_controller_1 = require("./documents.controller");
// import auth from '../../middlewares/auth';
const router = express_1.default.Router();
router.post("/", 
// auth("admin", "student", "user"),
multer_1.upload.single('file'), documents_controller_1.UploadDocumentController.UploadDocument);
exports.UploadDocumentRoutes = router;
