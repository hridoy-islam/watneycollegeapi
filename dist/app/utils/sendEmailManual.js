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
exports.sendEmailManual = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
require("dotenv").config();
const { google } = require("googleapis");
const sendEmailManual = (to, template, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "https://developers.google.com/oauthplayground");
    oAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    const accessToken = yield oAuth2Client.getAccessToken();
    const transporter = nodemailer_1.default.createTransport({
        // host: "smtp.ionos.co.uk",
        // port: 587,
        // secure: false,
        service: "Gmail",
        auth: {
            type: "OAuth2",
            user: process.env.SENDER_EMAIL,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: (accessToken === null || accessToken === void 0 ? void 0 : accessToken.token) || "",
        },
    });
    try {
        const html = yield ejs_1.default.renderFile(__dirname + "/../static/email_template/" + template + ".ejs", {
            body: body
        }, {
            async: true,
        });
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html: html,
        };
        const info = yield transporter.sendMail(mailOptions);
        return info;
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
});
exports.sendEmailManual = sendEmailManual;
