"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("./authController");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginValidationSchema), authController_1.AuthControllers.login);
router.post('/refreshToken', 
// validateRequest(AuthValidations.refreshTokenZodSchema),
authController_1.AuthControllers.refreshToken);
router.post("/google", (0, validateRequest_1.default)(auth_validation_1.AuthValidations.googleValidationSchema), authController_1.AuthControllers.googleLoginController);
router.post("/signup", (0, validateRequest_1.default)(auth_validation_1.AuthValidations.createUserValidationSchema), authController_1.AuthControllers.createUser);
// router.post(
//   '/create-user',
//   auth('admin'),
//   validateRequest(AuthValidations.createUserValidationSchema),
//   AuthControllers.createUser,
// );
router.patch("/forget", 
// validateRequest(AuthValidations.forgetPasswordValidationSchema),
authController_1.AuthControllers.forgetPassword);
router.patch("/validate", authController_1.AuthControllers.validateReset);
router.patch('/reset', authController_1.AuthControllers.resetPassword);
router.post('/emailotp', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.emailSentOtpSchema), authController_1.AuthControllers.emailVerifySendOtp);
router.patch("/verifyemail", (0, validateRequest_1.default)(auth_validation_1.AuthValidations.verifyEmailAccount), authController_1.AuthControllers.verifyEmail);
router.patch("/resend-otp", authController_1.AuthControllers.emailVerifySendOtp);
router.patch("/:id/change-password", authController_1.AuthControllers.ChangePassword);
router.patch("/users/:id", authController_1.AuthControllers.PersonalInformation);
exports.AuthRoutes = router;
