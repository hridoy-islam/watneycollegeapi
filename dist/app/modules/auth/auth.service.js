"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthServices = exports.verifyEmailIntoDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_utils_1 = require("./auth.utils");
const sendEmail_1 = require("../../utils/sendEmail");
const config_1 = __importDefault(require("../../config"));
const moment_1 = __importDefault(require("moment"));
const UAParser = __importStar(require("ua-parser-js"));
const request_ip_1 = __importDefault(require("request-ip"));
const crypto_1 = __importDefault(require("crypto"));
function generateOtpAndExpiry() {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = (0, moment_1.default)().add(10, "minutes").toDate();
    return { otp, otpExpiry };
}
const checkLogin = (payload, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const foundUser = yield user_model_1.User.isUserExists(payload.email);
        if (!foundUser) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Login Details are not correct");
        }
        if (foundUser.isDeleted) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This Account Has Been Deleted.");
        }
        if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, foundUser === null || foundUser === void 0 ? void 0 : foundUser.password))) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password does not match");
        }
        // Get the client's IP address
        const ipAddress = request_ip_1.default.getClientIp(req);
        if (!ipAddress) {
            console.error("Could not retrieve IP address from request.");
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "IP address retrieval failed");
        }
        // Parse user agent
        const parser = new UAParser.UAParser(req.headers["user-agent"]);
        const uaResult = parser.getResult();
        // Create device fingerprint
        const deviceFingerprint = crypto_1.default
            .createHash("sha256")
            .update(req.headers["user-agent"] + req.headers["accept-language"])
            .digest("hex");
        // Prepare user agent info object
        const userAgentInfo = {
            browser: {
                name: uaResult.browser.name,
                version: uaResult.browser.version,
            },
            os: {
                name: uaResult.os.name,
                version: uaResult.os.version,
            },
            device: {
                model: ((_a = uaResult.device) === null || _a === void 0 ? void 0 : _a.model) || "Desktop",
                type: ((_b = uaResult.device) === null || _b === void 0 ? void 0 : _b.type) || "desktop",
                vendor: ((_c = uaResult.device) === null || _c === void 0 ? void 0 : _c.vendor) || "unknown",
            },
            cpu: {
                architecture: uaResult.cpu.architecture,
            },
            ipAddress: ipAddress,
            macAddress: deviceFingerprint,
            timestamp: new Date(),
        };
        // Update user with new login info
        yield user_model_1.User.findByIdAndUpdate(foundUser._id, {
            $push: {
                userAgentInfo: userAgentInfo,
            },
        });
        // Prepare JWT payload
        // If user is not authorized, generate OTP and send it
        if (!foundUser.isValided) {
            const { otp, otpExpiry } = generateOtpAndExpiry();
            yield user_model_1.User.findByIdAndUpdate(foundUser._id, {
                otp,
                otpExpiry,
                isUsed: false,
            });
            const emailSubject = "Validate Your Profile with OTP";
            yield (0, sendEmail_1.sendEmail)(foundUser.email, "verify_email", emailSubject, foundUser.name, otp);
        }
        const jwtPayload = {
            _id: (_d = foundUser._id) === null || _d === void 0 ? void 0 : _d.toString(),
            email: foundUser === null || foundUser === void 0 ? void 0 : foundUser.email,
            name: foundUser === null || foundUser === void 0 ? void 0 : foundUser.name,
            role: foundUser === null || foundUser === void 0 ? void 0 : foundUser.role,
            authorized: foundUser === null || foundUser === void 0 ? void 0 : foundUser.authorized,
            isValided: foundUser === null || foundUser === void 0 ? void 0 : foundUser.isValided,
            isCompleted: foundUser === null || foundUser === void 0 ? void 0 : foundUser.isCompleted,
        };
        // Generate access and refresh tokens
        const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
        const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
        return {
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        console.error("Error in checkLogin service:", error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "An error occurred during login");
    }
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token || typeof token !== "string") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Refresh token is required and should be a valid string.");
    }
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    const foundUser = yield user_model_1.User.isUserExists(email);
    if (!foundUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid refresh token");
    }
    try {
        const jwtPayload = {
            _id: foundUser._id.toString(),
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
            authorized: foundUser === null || foundUser === void 0 ? void 0 : foundUser.authorized,
            isValided: foundUser === null || foundUser === void 0 ? void 0 : foundUser.isValided,
            isCompleted: foundUser === null || foundUser === void 0 ? void 0 : foundUser.isCompleted
        };
        // Generate new access token
        const newAccessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
        return {
            accessToken: newAccessToken,
        };
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid Refresh Token");
    }
});
const googleLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        // Check if the user exists
        const foundUser = yield user_model_1.User.isUserExists(payload.email);
        if (!foundUser) {
            // If user doesn't exist, register them
            const newUser = yield user_model_1.User.create({
                email: payload.email,
                name: payload.name,
                password: payload.password,
                googleUid: payload.googleUid,
                image: payload.image,
                phone: payload.phone,
                role: "company",
            });
            // Generate JWT for the new user
            const accessToken = jsonwebtoken_1.default.sign({
                _id: (_e = newUser._id) === null || _e === void 0 ? void 0 : _e.toString(),
                email: newUser === null || newUser === void 0 ? void 0 : newUser.email,
                name: newUser === null || newUser === void 0 ? void 0 : newUser.name,
                role: newUser === null || newUser === void 0 ? void 0 : newUser.role,
            }, `${config_1.default.jwt_access_secret}`, {
                expiresIn: "4d",
            });
            return {
                accessToken,
            };
        }
        // If user is deleted, block access
        if (foundUser.isDeleted) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This Account Has Been Deleted.");
        }
        // Generate JWT for the existing user
        const accessToken = jsonwebtoken_1.default.sign({
            _id: (_f = foundUser._id) === null || _f === void 0 ? void 0 : _f.toString(),
            email: foundUser === null || foundUser === void 0 ? void 0 : foundUser.email,
            name: foundUser === null || foundUser === void 0 ? void 0 : foundUser.name,
            role: foundUser === null || foundUser === void 0 ? void 0 : foundUser.role,
        }, `${config_1.default.jwt_access_secret}`, {
            expiresIn: "7d",
        });
        return {
            accessToken,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message || "Something went wrong during Google login");
    }
});
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExists(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is already exits!");
    }
    const { otp, otpExpiry } = generateOtpAndExpiry();
    const newUserPayload = Object.assign({}, payload);
    const result = yield user_model_1.User.create(newUserPayload);
    try {
        // const emailSubject = 'Your Password Reset OTP';
        // await sendEmail(
        //   payload.email,
        //   'reset_password_template',
        //   emailSubject,
        //   payload.name,
        //   otp
        // );
        // await sendEmail(
        //   payload.email,
        //   "welcome_template",
        //   "Welcome to Task Planner",
        //   payload.name
        // );
    }
    catch (error) {
        console.error("Error sending welcome email:", error);
    }
    return result;
});
const EmailSendOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield user_model_1.User.isUserExists(email);
    if (!foundUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No User Found");
    }
    const { otp, otpExpiry } = generateOtpAndExpiry();
    yield user_model_1.User.findByIdAndUpdate(foundUser._id, {
        otp,
        otpExpiry,
        isUsed: false,
    });
    const emailSubject = "Your Password Reset OTP";
    yield (0, sendEmail_1.sendEmail)(email, "reset_password_template", emailSubject, foundUser.name, otp);
    yield user_model_1.User.updateOne({ email }, { otp, otpExpiry });
});
const verifyEmailIntoDB = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const foundUser = yield user_model_1.User.findOne({ email: email.toLowerCase() });
    if (!foundUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Email is not correct");
    }
    // Check OTP
    if (foundUser.otp !== otp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid OTP!");
    }
    // Check OTP expiry using moment
    if (foundUser.otpExpiry && (0, moment_1.default)().isAfter((0, moment_1.default)(foundUser.otpExpiry))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "OTP has expired");
    }
    // Update user: mark as authorized and clear OTP
    yield user_model_1.User.updateOne({ email: email.toLowerCase() }, { otp: "", otpExpires: null, isValided: true });
    const jwtPayload = {
        _id: (_g = foundUser._id) === null || _g === void 0 ? void 0 : _g.toString(),
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        isValided: foundUser.isValided
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.verifyEmailIntoDB = verifyEmailIntoDB;
// const forgetPassword = async (email: string) => {
//   const user = await User.isUserExists(email);
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
//   }
//   const jwtPayload = {
//     email: user.email,
//     role: user.role,
//   };
//   const resetToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     "10m"
//   );
//   const resetUILink = `${config.reset_pass_ui_link}?id=${user.email}&token=${resetToken} `;
//   sendEmail(user.email, resetUILink);
// };
const forgetPasswordOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExists(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
    }
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ _id: payload.userId }).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
    }
    user.password = payload.password;
    yield user.save();
    return { message: "Password updated successfully" };
});
const ChangePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Find the user by ID
    const user = yield user_model_1.User.findById(userId).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Step 2: Verify the current password
    const isPasswordValid = yield user_model_1.User.isPasswordMatched(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Current password is incorrect");
    }
    user.password = newPassword;
    yield user.save();
    // Return success message
    return { message: "Password updated successfully" };
});
const requestOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield user_model_1.User.isUserExists(email);
    if (!foundUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Email is not correct");
    }
    const { otp, otpExpiry } = generateOtpAndExpiry();
    yield user_model_1.User.findByIdAndUpdate(foundUser._id, {
        otp,
        otpExpiry,
        isUsed: false,
    });
    const emailSubject = "Your Password Reset OTP";
    yield (0, sendEmail_1.sendEmail)(email, "reset_password_template", emailSubject, foundUser.name, otp);
});
const validateOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists
    const foundUser = yield user_model_1.User.isUserExists(email);
    if (!foundUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Email not found");
    }
    // Check if the OTP is linked to a valid reset request and is not already used
    const passwordReset = yield user_model_1.User.findOne({
        _id: foundUser._id,
        isUsed: false,
    });
    if (!passwordReset || passwordReset.otp !== otp) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid OTP");
    }
    // Check if OTP has expired using moment
    if ((0, moment_1.default)(passwordReset.otpExpiry).isBefore((0, moment_1.default)())) {
        console.log("OTP Expired. Expiry Time:", passwordReset.otpExpiry, "Current Time:", (0, moment_1.default)().toDate());
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "OTP has expired");
    }
    yield passwordReset.updateOne({ isUsed: true, otp: "" });
    // Create the reset token (JWT)
    const resetToken = jsonwebtoken_1.default.sign({
        _id: foundUser._id.toString(),
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
    }, `${config_1.default.jwt_access_secret}`, { expiresIn: "10m" } // Set token expiry to 10 minutes
    );
    // Send confirmation email to the user
    // await sendEmail(
    //   email,
    //   "validated_otp_template",
    //   "OTP Validated Successfully",
    //   foundUser.name
    // );
    // Return the reset token for further use
    return { resetToken };
});
const personalInformationIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.AuthServices = {
    checkLogin,
    createUserIntoDB,
    resetPassword,
    forgetPasswordOtp,
    googleLogin,
    verifyEmailIntoDB: exports.verifyEmailIntoDB,
    EmailSendOTP,
    refreshToken,
    ChangePassword,
    validateOtp,
    requestOtp,
    personalInformationIntoDB
};
