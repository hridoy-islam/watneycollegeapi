"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required." }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
const forgetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "User email is required!",
        }),
    }),
});
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "User Email is Required" }),
        password: zod_1.z.string({ required_error: "Password required" }),
    }),
});
const googleValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "User Name is Required" }),
        email: zod_1.z.string({ required_error: "User Email is Required" }),
        password: zod_1.z.string({ required_error: "Password is Required" }),
        googleUid: zod_1.z.string({ required_error: "google UID required" }),
        image: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
    }),
});
const validateOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        otp: zod_1.z.string().length(4, "OTP must be exactly 4 digits"),
    }),
});
const verifyEmailAccount = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        otp: zod_1.z.string().length(4, "OTP must be exactly 4 digits"),
    }),
});
const resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid Email Address"),
        newPassword: zod_1.z.string({ required_error: "Password is Required" }),
    }),
});
const emailSentOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid Email Address"),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
exports.AuthValidations = {
    loginValidationSchema,
    forgetPasswordValidationSchema,
    createUserValidationSchema,
    googleValidationSchema,
    validateOtpSchema,
    verifyEmailAccount,
    resetPasswordSchema,
    emailSentOtpSchema,
    refreshTokenZodSchema,
};
