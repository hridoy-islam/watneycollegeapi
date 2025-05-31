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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const sendEmail = (to, template, subject, name, otp, title) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        // host: "smtp.ionos.co.uk",
        // port: 587,
        // secure: false,
        service: "Gmail",
        auth: {
            user: "mahitasnimulhasan20@gmail.com",
            pass: "zgyo izhr jrkh twgp",
        },
    });
    try {
        const html = yield ejs_1.default.renderFile(__dirname + "/../static/email_template/" + template + ".ejs", {
            otp: otp,
            name: name,
            title: title,
        });
        const mailOptions = {
            from: "mahitasnimulhasan20@gmail.com",
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
exports.sendEmail = sendEmail;
