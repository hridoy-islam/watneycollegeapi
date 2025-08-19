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
exports.UploadDocumentService = void 0;
const storage_1 = require("@google-cloud/storage");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const storage = new storage_1.Storage({
    keyFilename: "./work.json",
    projectId: "vast-pride-453709-n7",
});
const bucketName = "watney";
const bucket = storage.bucket(bucketName);
const UploadDocumentToGCS = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { entityId, file_type } = payload;
    try {
        if (!file)
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No file provided");
        const fileName = `${Date.now()}-${file.originalname}`;
        const gcsFile = bucket.file(fileName);
        yield new Promise((resolve, reject) => {
            const stream = gcsFile.createWriteStream({
                metadata: { contentType: file.mimetype }, // Set metadata to determine file type
            });
            stream.on("error", (err) => {
                console.error("Error during file upload:", err);
                reject(err);
            });
            stream.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    // Make the file publicly accessible
                    yield gcsFile.makePublic();
                    resolve(true);
                }
                catch (err) {
                    console.error("Error making the file public:", err);
                    reject(err);
                }
            }));
            // Send the file buffer to GCS
            stream.end(file.buffer);
        });
        const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        const fileContentText = file.buffer.toString("utf-8");
        // Check file type and determine where to save the file URL
        if (file_type === "userProfile") {
            const user = yield user_model_1.User.findById(entityId);
            if (!user)
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
            user.image = fileUrl;
            yield user.save();
            return { entityId, file_type, fileUrl };
        }
        else if (file_type === "studentDoc") {
            return { entityId, file_type, fileUrl };
        }
        else if (file_type === "resumeDoc") {
            const pdfData = yield (0, pdf_parse_1.default)(file.buffer);
            const extractedText = pdfData.text;
            return { entityId, file_type, fileUrl, fileContent: extractedText };
        }
        else if (file_type === "careerDoc") {
            return { entityId, file_type, fileUrl };
        }
    }
    catch (error) {
        console.error("File upload failed:", error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "File upload failed");
    }
});
exports.UploadDocumentService = {
    UploadDocumentToGCS,
};
