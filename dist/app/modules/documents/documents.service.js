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
exports.UploadDocumentService = exports.uploadDocument = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mammoth_1 = __importDefault(require("mammoth"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
function extractTextFromPdf(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, pdf_parse_1.default)(buffer);
            if (!data.text || data.text.trim().length === 0) {
                throw new Error('PDF appears to be empty or contains no extractable text');
            }
            return data.text;
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to parse PDF: ' + (error instanceof Error ? error.message : 'Invalid PDF format'));
        }
    });
}
function extractTextFromDocx(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield mammoth_1.default.extractRawText({ buffer });
            if (!result.value || result.value.trim().length === 0) {
                throw new Error('Document appears to be empty');
            }
            return result.value;
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to parse Word document: ' + (error instanceof Error ? error.message : 'Invalid document format'));
        }
    });
}
function uploadDocument(file, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'No file uploaded');
        }
        const filePath = path_1.default.join(process.cwd(), 'uploads', file.filename);
        let textContent = '';
        try {
            // Verify file exists before processing
            try {
                yield promises_1.default.access(filePath);
            }
            catch (_a) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'File not found on server');
            }
            const buffer = yield promises_1.default.readFile(filePath);
            // Extract text based on file type
            if (file.mimetype === 'application/pdf') {
                textContent = yield extractTextFromPdf(buffer);
            }
            else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.mimetype === 'application/msword') {
                textContent = yield extractTextFromDocx(buffer);
            }
            else {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Unsupported file type. Only PDF and Word documents are allowed');
            }
            return {
                originalName: file.originalname,
                textContent: textContent,
                filePath: filePath
            };
        }
        catch (error) {
            // Clean up the uploaded file if processing fails
            try {
                yield promises_1.default.unlink(filePath);
            }
            catch (unlinkError) {
                console.error('Failed to delete file:', unlinkError);
            }
            // If error is already an AppError, rethrow it
            if (error instanceof AppError_1.default) {
                throw error;
            }
            // Handle specific parsing errors
            if (error instanceof Error && error.message.includes('PDF')) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to parse PDF file. The file may be corrupted.');
            }
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to process document: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    });
}
exports.uploadDocument = uploadDocument;
exports.UploadDocumentService = {
    // UploadDocumentToGCS,
    uploadDocument
};
