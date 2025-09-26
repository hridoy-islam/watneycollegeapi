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
exports.ApplicationCourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const applicationCourse_model_1 = require("./applicationCourse.model");
const applicationCourse_constant_1 = require("./applicationCourse.constant");
const sendEmail_1 = require("../../utils/sendEmail");
const moment_1 = __importDefault(require("moment"));
const course_model_1 = __importDefault(require("../course/course.model"));
const sendEmailUpdateCourse_1 = require("../../utils/sendEmailUpdateCourse");
const sendEmailAdminCourse_1 = require("../../utils/sendEmailAdminCourse");
// const generateRefId = async (courseId: string): Promise<string> => {
//   const course = await Course.findById(courseId).select("courseCode");
//   if (!course || !course.courseCode) {
//     throw new Error("Invalid course or courseCode not found");
//   }
//   const now = moment();
//   const yy = now.format("YY"); // last 2 digits of year
//   const mm = now.format("MM"); // month
//   const courseCode = course.courseCode;
//   // Find the latest application for this course in this month
//   const startOfMonth = now.startOf("month").toDate();
//   const endOfMonth = now.endOf("month").toDate();
//   const lastApplication = await ApplicationCourse.findOne({
//     courseId,
//     createdAt: { $gte: startOfMonth, $lte: endOfMonth },
//   })
//     .sort({ createdAt: -1 }) // get latest
//     .select("refId");
//   // Extract last serial
//   let serialNumber = 1;
//   if (lastApplication?.refId) {
//     const lastSerialStr = lastApplication.refId.slice(-3); // last 3 digits
//     const lastSerial = parseInt(lastSerialStr, 10);
//     serialNumber = lastSerial + 1;
//   }
//   const serial = String(serialNumber).padStart(3, "0");
//   // Format: WC-YY-MM-CC-0SN
//   const refId = `WC${yy}${mm}${courseCode}${serial}`;
//   return refId;
// };
const generateRefId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.default.findById(courseId).select("courseCode");
    if (!course || !course.courseCode) {
        throw new Error("Invalid course or courseCode not found");
    }
    const now = (0, moment_1.default)();
    const yy = now.format("YY"); // last 2 digits of year
    const mm = now.format("MM"); // month
    const courseCode = course.courseCode;
    // Month boundaries
    const startOfMonth = now.clone().startOf("month").toDate();
    const endOfMonth = now.clone().endOf("month").toDate();
    // Find the latest application for this course in this month
    const lastApplication = yield applicationCourse_model_1.ApplicationCourse.findOne({
        courseId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    })
        .sort({ createdAt: -1 })
        .select("refId");
    // Initial serial number
    let serialNumber = 1;
    if (lastApplication === null || lastApplication === void 0 ? void 0 : lastApplication.refId) {
        const lastSerialStr = lastApplication.refId.slice(-3); // last 3 digits
        const lastSerial = parseInt(lastSerialStr, 10);
        serialNumber = isNaN(lastSerial) ? 1 : lastSerial + 1;
    }
    let refId;
    let exists = true;
    // Loop until a unique refId is found
    while (exists) {
        const serial = String(serialNumber).padStart(3, "0");
        refId = `WC${yy}${mm}${courseCode}${serial}`;
        // Check if this refId already exists
        exists = !!(yield applicationCourse_model_1.ApplicationCourse.exists({ refId }));
        if (exists) {
            serialNumber++; // increment and try again
        }
    }
    return refId;
});
const getAllApplicationCourseFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const ApplicationCourseQuery = new QueryBuilder_1.default(applicationCourse_model_1.ApplicationCourse.find()
        .populate({
        path: "studentId",
        select: "title firstName initial lastName email phone studentType",
    })
        .populate("intakeId")
        .populate("courseId"), query)
        .search(applicationCourse_constant_1.ApplicationCourseSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield ApplicationCourseQuery.countTotal();
    const result = yield ApplicationCourseQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleApplicationCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield applicationCourse_model_1.ApplicationCourse.findById(id)
        .populate({
        path: "studentId",
        select: "title firstName initial lastName email phone studentType",
    })
        .populate("intakeId")
        .populate("courseId");
    return result;
});
// const updateApplicationCourseIntoDB = async (
//   id: string,
//   payload: Partial<TApplicationCourse>
// ) => {
//   const applicationCourse = await ApplicationCourse.findById(id);
//   if (!applicationCourse) {
//     throw new AppError(httpStatus.NOT_FOUND, "ApplicationCourse not found");
//   }
//   const result = await ApplicationCourse.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });
//   return result;
// };
const updateApplicationCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // Step 1: Fetch the current course with populations
    const applicationCourse = yield applicationCourse_model_1.ApplicationCourse.findById(id)
        .populate("courseId", "name")
        .populate("intakeId", "termName")
        .populate("studentId", "name email phone");
    if (!applicationCourse) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "ApplicationCourse not found");
    }
    const previousCourseId = (_c = (_b = (_a = applicationCourse.courseId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b);
    const previousCourseName = ((_d = applicationCourse.courseId) === null || _d === void 0 ? void 0 : _d.name) || "";
    // Step 2: Apply updates
    if (payload.courseId && payload.courseId.toString() !== previousCourseId) {
        // courseId changed → generate new refId
        const newRefId = yield generateRefId(payload.courseId.toString());
        payload.refId = newRefId;
    }
    // Merge updates into the doc
    Object.assign(applicationCourse, payload);
    yield applicationCourse.save();
    // Re-populate to get fresh course/intake/student data
    yield applicationCourse.populate([
        { path: "courseId", select: "name" },
        { path: "intakeId", select: "termName" },
        { path: "studentId", select: "name email phone" },
    ]);
    const { studentId, courseId, intakeId } = applicationCourse;
    // Step 3: Prepare email data
    const emailData = {
        studentName: studentId === null || studentId === void 0 ? void 0 : studentId.name,
        studentEmail: studentId === null || studentId === void 0 ? void 0 : studentId.email,
        courseName: courseId === null || courseId === void 0 ? void 0 : courseId.name,
        termName: intakeId === null || intakeId === void 0 ? void 0 : intakeId.termName,
        previousCourseName,
    };
    // Step 4: Send emails
    try {
        yield (0, sendEmailUpdateCourse_1.sendEmailUpdateCourse)(emailData.studentEmail, "course-change", "Your Application Details Have Been Updated", emailData.studentName, emailData.studentEmail, emailData.courseName, emailData.termName, emailData.previousCourseName);
    }
    catch (err) {
        console.warn("Failed to send update email:", err);
    }
    try {
        yield (0, sendEmailAdminCourse_1.sendEmailAdminCourse)("admissions@watneycollege.co.uk", "course-change-admin", "Student Application Course Updated", emailData.studentName, emailData.studentEmail, emailData.courseName, emailData.termName, emailData.previousCourseName);
    }
    catch (err) {
        console.warn("Failed to send admin email:", err);
    }
    // ✅ Return updated doc
    return applicationCourse;
});
const createApplicationCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h, _j, _k, _l, _m;
    const { courseId, intakeId, studentId } = payload;
    // Ensure all required fields are provided
    if (!courseId || !intakeId || !studentId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Missing required fields: courseId, intakeId, and studentId are all required");
    }
    // Check if an application already exists with the same course, student, and intake
    const existingApplication = yield applicationCourse_model_1.ApplicationCourse.findOne({
        courseId,
        intakeId,
        studentId,
    });
    if (existingApplication) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have already applied for this course with the selected intake.");
    }
    const refId = yield generateRefId(courseId.toString());
    const result = yield applicationCourse_model_1.ApplicationCourse.create(Object.assign(Object.assign({}, payload), { refId }));
    if (!result || !result._id) {
        throw new Error("Course creation failed");
    }
    const populatedResult = yield applicationCourse_model_1.ApplicationCourse.findById(result._id)
        .populate("courseId", "name")
        .populate("intakeId", "termName")
        .populate("studentId", "name email studentType phone countryOfResidence dateOfBirth");
    if (!populatedResult) {
        throw new Error("Failed to populate course application");
    }
    const title = (_e = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.courseId) === null || _e === void 0 ? void 0 : _e.name;
    const applicantName = (_f = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.studentId) === null || _f === void 0 ? void 0 : _f.name;
    const applicantEmail = (_g = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.studentId) === null || _g === void 0 ? void 0 : _g.email;
    const adminSubject = `New Enrollment Submission for ${title}`;
    const emailSubject = `Thank You for Applying to Watney College`;
    const otp = "";
    const termName = (_h = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.intakeId) === null || _h === void 0 ? void 0 : _h.termName;
    const studentType = (_j = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.studentId) === null || _j === void 0 ? void 0 : _j.studentType;
    const phone = (_k = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.studentId) === null || _k === void 0 ? void 0 : _k.phone;
    const countryOfResidence = (_l = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.studentId) === null || _l === void 0 ? void 0 : _l.countryOfResidence;
    const studentStatus = studentType === "eu" ? "Home Student" : "International Student";
    const dob = (_m = populatedResult === null || populatedResult === void 0 ? void 0 : populatedResult.studentId) === null || _m === void 0 ? void 0 : _m.dateOfBirth;
    const formattedDob = dob ? (0, moment_1.default)(dob).format("DD MMM, YYYY") : "N/A";
    yield (0, sendEmail_1.sendEmail)(applicantEmail, "course-register", emailSubject, applicantName, otp, title);
    yield (0, sendEmail_1.sendEmail)("admission@watneycollege.co.uk", "course-register-admin", adminSubject, applicantName, otp, title, applicantEmail, termName, studentStatus, phone, countryOfResidence, formattedDob);
    return result;
});
exports.ApplicationCourseServices = {
    getAllApplicationCourseFromDB,
    getSingleApplicationCourseFromDB,
    updateApplicationCourseIntoDB,
    createApplicationCourseIntoDB,
};
