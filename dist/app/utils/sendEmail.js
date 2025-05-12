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
const sendEmail = (to, template, subject, username, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp-relay.gmail.com",
        port: 587,
        secure: false,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "noreply@taskplanner.co.uk",
            pass: "ddgc rryi lucp ckwx",
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    ejs_1.default.renderFile(__dirname + "/../static/email_template/" + template + ".ejs", {
        name: username,
        next_action: "https://taskplanner.co.uk/login",
        support_url: "https://taskplanner.co.uk",
        action_url: "https://taskplanner.co.uk/login",
        login_url: "https://taskplanner.co.uk/login",
        username,
        otp,
    }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            var mainOptions = {
                from: "noreply@taskplanner.co.uk",
                to,
                subject,
                html: data,
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Message sent: " + info.response);
                }
            });
        }
    });
});
exports.sendEmail = sendEmail;
