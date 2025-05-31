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
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1588815",
    key: "271e6288274030d8251a",
    secret: "f4875429002ed9e85c90",
    cluster: "ap2",
    useTLS: true,
});
pusher.trigger("my-channel", "my-event", {
    message: "hello world",
});
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
// app.use((req, res, next) => {
//   // Set the Access-Control-Allow-Origin header to allow requests from any origin
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   // Set the Access-Control-Allow-Methods header to allow GET, POST, PUT, DELETE, and OPTIONS methods
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   // Set the Access-Control-Allow-Headers header to allow the Origin, X-Requested-With, Content-Type, Accept, and Authorization headers
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   // Call next() to pass the request to the next middleware function
//   next();
// });
// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://watneycollegeform.netlify.ap/",
    ],
    credentials: true,
}));
// application routes
app.use("/api", routes_1.default);
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({ message: "working nicely" });
});
app.get("/", test);
app.use(globalErrorhandler_1.default);
//Not Found
app.use(notFound_1.default);
exports.default = app;
