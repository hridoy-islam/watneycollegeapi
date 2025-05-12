"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.cwd() + "/uploads/");
//   },
//   filename: function (req, file, cb) {
//     return cb(
//       null,
//       `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });
// export const upload = multer({ storage: storage });
// import multer from "multer";
// // Configure multer to store files in memory (instead of disk storage)
// const storage = multer.memoryStorage();
// export const upload = multer({ storage: storage });
// Ensure the uploads directory exists
const uploadDir = path_1.default.join(process.cwd(), "uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        const safeName = file.originalname.replace(/\s+/g, "_").replace(ext, "");
        const fileName = `${safeName}_${Date.now()}${ext}`;
        // Schedule deletion after 1 minute
        const filePath = path_1.default.join(uploadDir, fileName);
        setTimeout(() => {
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
                else {
                    console.log(`Deleted temporary file: ${filePath}`);
                }
            });
        }, 60 * 1000); // 1 minute
        cb(null, fileName);
    },
});
exports.upload = (0, multer_1.default)({ storage });
