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
exports.EmailServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const email_constant_1 = require("./email.constant");
const email_model_1 = __importDefault(require("./email.model"));
const sendEmailManual_1 = require("../../utils/sendEmailManual");
const user_model_1 = require("../user/user.model");
const moment_1 = __importDefault(require("moment"));
const applicationCourse_model_1 = require("../applicationCourse/applicationCourse.model");
const course_code_model_1 = __importDefault(require("../course-code/course-code.model"));
const signature_model_1 = __importDefault(require("../signature/signature.model"));
// const createEmailIntoDB = async (payload: any) => {
//   try {
//     const {
//       emailDraft,
//       userId,
//       issuedBy,
//       subject: emailSubject,
//       body: emailBody,
//       applicationId,
//     } = payload;
//     // Find user
//     const foundUser = await User.findById(userId);
//     if (!foundUser) {
//       throw new AppError(httpStatus.NOT_FOUND, "User not found");
//     }
//     // Fetch course name if applicationId is provided
//     let courseName = "";
//     let intake = "";
//     let applicationStatus = "";
//     let applicationDate = "";
//     if (applicationId) {
//       const application = await ApplicationCourse.findById(applicationId)
//         .populate("courseId")
//         .populate("intakeId");
//       courseName = (application?.courseId as any)?.name || "";
//       intake = (application?.intakeId as any)?.termName || "";
//       applicationStatus = application?.status || "";
//       applicationDate = application?.createdAt
//         ? moment(application.createdAt).format("DD MMM, YYYY")
//         : "";
//     }
//     // Helper to replace variables
//     const replaceVariable = (text: string): string => {
//       return text
//         .replace(/\[admin\]/g, "Watney College")
//         .replace(/\[adminEmail\]/g, "info@watneycollege.co.uk")
//         .replace(/\[courseName\]/g, courseName)
//         .replace(/\[intake\]/g, intake)
//         .replace(/\[applicationStatus\]/g, applicationStatus)
//         .replace(/\[applicationDate\]/g, applicationDate)
//         .replace(/\[name\]/g, foundUser.name || "")
//         .replace(/\[title\]/g, foundUser.title || "")
//         .replace(/\[firstName\]/g, foundUser.firstName || "")
//         .replace(/\[lastName\]/g, foundUser.lastName || "")
//         .replace(/\[phone\]/g, foundUser.phone || "")
//         .replace(
//           /\[dateOfBirth\]/g,
//           foundUser.dateOfBirth
//             ? moment(foundUser.dateOfBirth).format("DD MMM, YYYY")
//             : ""
//         )
//         .replace(/\[email\]/g, foundUser.email || "")
//         .replace(/\[countryOfBirth\]/g, foundUser.countryOfBirth || "")
//         .replace(/\[nationality\]/g, foundUser.nationality || "")
//         .replace(/\[countryOfResidence\]/g, foundUser.countryOfResidence || "")
//         .replace(/\[ethnicity\]/g, foundUser.ethnicity || "")
//         .replace(/\[gender\]/g, foundUser.gender || "")
//         .replace(/\[postalAddressLine1\]/g, foundUser.postalAddressLine1 || "")
//         .replace(/\[postalAddressLine2\]/g, foundUser.postalAddressLine2 || "")
//         .replace(/\[postalCity\]/g, foundUser.postalCity || "")
//         .replace(/\[postalCountry\]/g, foundUser.postalCountry || "")
//         .replace(/\[postalPostCode\]/g, foundUser.postalPostCode || "")
//         .replace(
//           /\[residentialAddressLine1\]/g,
//           foundUser.residentialAddressLine1 || ""
//         )
//         .replace(
//           /\[residentialAddressLine2\]/g,
//           foundUser.residentialAddressLine2 || ""
//         )
//         .replace(/\[residentialCity\]/g, foundUser.residentialCity || "")
//         .replace(/\[residentialCountry\]/g, foundUser.residentialCountry || "")
//         .replace(
//           /\[residentialPostCode\]/g,
//           foundUser.residentialPostCode || ""
//         )
//         .replace(/\[emergencyAddress\]/g, foundUser.emergencyAddress || "")
//         .replace(
//           /\[emergencyContactNumber\]/g,
//           foundUser.emergencyContactNumber || ""
//         )
//         .replace(/\[emergencyEmail\]/g, foundUser.emergencyEmail || "")
//         .replace(/\[emergencyFullName\]/g, foundUser.emergencyFullName || "")
//         .replace(
//           /\[emergencyRelationship\]/g,
//           foundUser.emergencyRelationship || ""
//         )
//         .replace(
//           /\[applicationLocation\]/g,
//           foundUser.applicationLocation || ""
//         );
//     };
//     // Replace variables in subject and body
//     const processedSubject = replaceVariable(emailSubject);
//     const processedBody = replaceVariable(emailBody);
//     // Save email with processed body (plain text with variables replaced)
//     const result = await Email.create({
//       ...payload,
//       subject: processedSubject,
//       body: processedBody, // Already replaced
//     });
//     // Send email (with <br/> for line breaks)
//     const htmlBody = processedBody.replace(/\n/g, "<br/>");
//     await sendEmailManual(
//       foundUser.email,
//       "custom_template",
//       processedSubject,
//       htmlBody
//     );
//     // Update status to 'sent'
//     const updatedEmail = await Email.findByIdAndUpdate(
//       result._id,
//       { status: "sent" },
//       { new: true, runValidators: true }
//     );
//     return updatedEmail;
//   } catch (error: any) {
//     console.error("Error in createEmailIntoDB:", error);
//     if (error instanceof AppError) {
//       throw error;
//     }
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       error.message || "Failed to create or send email"
//     );
//   }
// };
const createEmailIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { emailDraft, userId, issuedBy, subject: emailSubject, body: emailBody, applicationId, } = payload;
        // Find user
        const foundUser = yield user_model_1.User.findById(userId);
        if (!foundUser) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        // Fetch course name if applicationId is provided
        let courseName = "";
        let intake = "";
        let applicationStatus = "";
        let applicationDate = "";
        if (applicationId) {
            const application = yield applicationCourse_model_1.ApplicationCourse.findById(applicationId)
                .populate("courseId")
                .populate("intakeId");
            courseName = ((_a = application === null || application === void 0 ? void 0 : application.courseId) === null || _a === void 0 ? void 0 : _a.name) || "";
            intake = ((_b = application === null || application === void 0 ? void 0 : application.intakeId) === null || _b === void 0 ? void 0 : _b.termName) || "";
            applicationStatus = (application === null || application === void 0 ? void 0 : application.status) || "";
            applicationDate = (application === null || application === void 0 ? void 0 : application.createdAt)
                ? (0, moment_1.default)(application.createdAt).format("DD MMM, YYYY")
                : "";
        }
        // Enhanced helper to replace all variables including dynamic ones
        const replaceVariables = (text) => __awaiter(void 0, void 0, void 0, function* () {
            let replacedText = text;
            // 1. Replace basic variables
            replacedText = replacedText
                .replace(/\[admin\]/g, "Watney College")
                .replace(/\[adminEmail\]/g, "info@watneycollege.co.uk")
                .replace(/\[courseName\]/g, courseName)
                .replace(/\[intake\]/g, intake)
                .replace(/\[applicationStatus\]/g, applicationStatus)
                .replace(/\[applicationDate\]/g, applicationDate)
                .replace(/\[todayDate\]/g, (0, moment_1.default)().format("DD MMM, YYYY"))
                .replace(/\[name\]/g, foundUser.name || "")
                .replace(/\[title\]/g, foundUser.title || "")
                .replace(/\[firstName\]/g, foundUser.firstName || "")
                .replace(/\[lastName\]/g, foundUser.lastName || "")
                .replace(/\[phone\]/g, foundUser.phone || "")
                .replace(/\[dateOfBirth\]/g, foundUser.dateOfBirth
                ? (0, moment_1.default)(foundUser.dateOfBirth).format("DD MMM, YYYY")
                : "")
                .replace(/\[email\]/g, foundUser.email || "")
                .replace(/\[countryOfBirth\]/g, foundUser.countryOfBirth || "")
                .replace(/\[nationality\]/g, foundUser.nationality || "")
                .replace(/\[countryOfResidence\]/g, foundUser.countryOfResidence || "")
                .replace(/\[ethnicity\]/g, foundUser.ethnicity || "")
                .replace(/\[gender\]/g, foundUser.gender || "")
                .replace(/\[postalAddressLine1\]/g, foundUser.postalAddressLine1 || "")
                .replace(/\[postalAddressLine2\]/g, foundUser.postalAddressLine2 || "")
                .replace(/\[postalCity\]/g, foundUser.postalCity || "")
                .replace(/\[postalCountry\]/g, foundUser.postalCountry || "")
                .replace(/\[postalPostCode\]/g, foundUser.postalPostCode || "")
                .replace(/\[residentialAddressLine1\]/g, foundUser.residentialAddressLine1 || "")
                .replace(/\[residentialAddressLine2\]/g, foundUser.residentialAddressLine2 || "")
                .replace(/\[residentialCity\]/g, foundUser.residentialCity || "")
                .replace(/\[residentialCountry\]/g, foundUser.residentialCountry || "")
                .replace(/\[residentialPostCode\]/g, foundUser.residentialPostCode || "")
                .replace(/\[emergencyAddress\]/g, foundUser.emergencyAddress || "")
                .replace(/\[emergencyContactNumber\]/g, foundUser.emergencyContactNumber || "")
                .replace(/\[emergencyEmail\]/g, foundUser.emergencyEmail || "")
                .replace(/\[emergencyFullName\]/g, foundUser.emergencyFullName || "")
                .replace(/\[emergencyRelationship\]/g, foundUser.emergencyRelationship || "")
                .replace(/\[applicationLocation\]/g, foundUser.applicationLocation || "");
            // 2. Handle [signature id="1"] tags → Replace with <img> tag
            const signatureRegex = /\[signature\s+id=["'](\d+)["']\]/g;
            const signatureMatches = [...replacedText.matchAll(signatureRegex)];
            const signaturePromises = signatureMatches.map((match) => __awaiter(void 0, void 0, void 0, function* () {
                const signatureId = match[1];
                const placeholder = match[0];
                try {
                    const signature = yield signature_model_1.default.findOne({ signatureId: signatureId });
                    const url = signature === null || signature === void 0 ? void 0 : signature.documentUrl;
                    if (url) {
                        // ✅ Replace with <img> tag for rendering in email
                        return {
                            placeholder,
                            replacement: `<img src="${url}" alt="Signature" style="max-width: 150px; margin: 10px 0;" />`,
                        };
                    }
                    return { placeholder, replacement: "" };
                }
                catch (error) {
                    console.error(`Error fetching signature ${signatureId}:`, error);
                    return { placeholder, replacement: "" };
                }
            }));
            // 3. Handle [courseCode="LEVEL25"] tags
            const courseCodeRegex = /\[courseCode=["']([^"']+)["']\]/g;
            const courseCodeMatches = [...replacedText.matchAll(courseCodeRegex)];
            const courseCodePromises = courseCodeMatches.map((match) => __awaiter(void 0, void 0, void 0, function* () {
                var _c;
                const courseCode = match[1];
                const placeholder = match[0];
                try {
                    const course = yield course_code_model_1.default.findOne({ courseCode: courseCode }).populate('course');
                    const courseName = (_c = course === null || course === void 0 ? void 0 : course.course) === null || _c === void 0 ? void 0 : _c.name;
                    return {
                        placeholder,
                        replacement: courseName || courseCode,
                    };
                }
                catch (error) {
                    console.error(`Error fetching course ${courseCode}:`, error);
                    return { placeholder, replacement: courseCode };
                }
            }));
            // 4. Wait for all async replacements and apply them
            const allPromises = [...signaturePromises, ...courseCodePromises];
            if (allPromises.length > 0) {
                const replacements = yield Promise.all(allPromises);
                // Apply all replacements to the text
                replacements.forEach(({ placeholder, replacement }) => {
                    replacedText = replacedText.replace(new RegExp(escapeRegExp(placeholder), 'g'), replacement);
                });
            }
            return replacedText;
        });
        // Helper function to escape special regex characters
        const escapeRegExp = (string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        // Replace variables in subject and body
        const processedSubject = yield replaceVariables(emailSubject);
        const processedBody = yield replaceVariables(emailBody);
        // Save email with processed body (plain text with variables replaced)
        const result = yield email_model_1.default.create(Object.assign(Object.assign({}, payload), { subject: processedSubject, body: processedBody }));
        // ✅ Convert newlines to <br> and render HTML (important!)
        const htmlBody = processedBody.replace(/\n/g, "<br/>");
        yield (0, sendEmailManual_1.sendEmailManual)(foundUser.email, "custom_template", processedSubject, htmlBody // This will now include <img> tags
        );
        // Update status to 'sent'
        const updatedEmail = yield email_model_1.default.findByIdAndUpdate(result._id, { status: "sent" }, { new: true, runValidators: true });
        return updatedEmail;
    }
    catch (error) {
        console.error("Error in createEmailIntoDB:", error);
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message || "Failed to create or send email");
    }
});
const getAllEmailFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const EmailQuery = new QueryBuilder_1.default(email_model_1.default.find().populate("issuedBy", "name email"), query)
        .search(email_constant_1.EmailSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield EmailQuery.countTotal();
    const result = yield EmailQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleEmailFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield email_model_1.default.findById(id);
    return result;
});
const updateEmailIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const email = yield email_model_1.default.findById(id);
    if (!email) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Email not found");
    }
    // Toggle `isDeleted` status for the selected user only
    // const newStatus = !user.isDeleted;
    // // Check if the user is a company, but only update the selected user
    // if (user.role === "company") {
    //   payload.isDeleted = newStatus;
    // }
    // Update only the selected user
    const result = yield email_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.EmailServices = {
    getAllEmailFromDB,
    getSingleEmailFromDB,
    updateEmailIntoDB,
    createEmailIntoDB,
};
