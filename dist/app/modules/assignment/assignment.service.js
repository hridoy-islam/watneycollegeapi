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
exports.AssignmentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const assignment_model_1 = require("./assignment.model");
const assignment_constant_1 = require("./assignment.constant");
const teacherCourse_model_1 = __importDefault(require("../teacherCourse/teacherCourse.model"));
const applicationCourse_model_1 = require("../applicationCourse/applicationCourse.model");
const moment_1 = __importDefault(require("moment"));
const getAllAssignmentFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const AssignmentQuery = new QueryBuilder_1.default(assignment_model_1.Assignment.find().populate([
        {
            path: "studentId",
            select: "firstName title initial lastName name email",
        },
        {
            path: "submissions.submitBy",
            select: "firstName lastName name email role", // populate student details
        },
        {
            path: "feedbacks.submitBy",
            select: "firstName lastName name email role", // populate teacher/admin details
        },
        {
            path: "observationFeedback.submitBy",
            select: "firstName lastName name email role", // populate teacher/admin details
        },
        {
            path: "finalFeedback.submitBy",
            select: "firstName lastName name email role", // populate teacher/admin details
        },
        {
            path: "applicationId",
            populate: {
                path: "courseId",
                select: "name", // get only course name
            },
        },
        {
            path: "unitId",
            select: "title", // get only unit title
        },
        {
            path: "unitMaterialId",
            select: "assignments", // populate only assignments from unit material
        },
    ]), query)
        .search(assignment_constant_1.AssignmentSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield AssignmentQuery.countTotal();
    const result = yield AssignmentQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleAssignmentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield assignment_model_1.Assignment.findById(id);
    return result;
});
const updateAssignmentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const assignment = yield assignment_model_1.Assignment.findById(id);
    if (!assignment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Assignment not found");
    }
    const result = yield assignment_model_1.Assignment.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const createAssignmentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield assignment_model_1.Assignment.create(payload);
    return result;
});
const getTeacherAssignmentFeedbackFromDB = (teacherId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherCourses = yield teacherCourse_model_1.default.find({ teacherId }).select("courseId");
    if (!teacherCourses || teacherCourses.length === 0) {
        return {
            meta: { page: 1, limit: 10, total: 0, totalPage: 0 },
            result: [],
        };
    }
    const courseIds = teacherCourses.map((tc) => tc.courseId);
    // Extract filters from query
    const courseIdFilter = query.courseId ? String(query.courseId) : null;
    const termIdFilter = query.termId ? String(query.termId) : null;
    // 2️⃣ Build the query for submitted assignments
    const AssignmentQuery = new QueryBuilder_1.default(assignment_model_1.Assignment.find({ status: "submitted" }).populate([
        {
            path: "studentId",
            select: "firstName title initial lastName name email",
        },
        {
            path: "submissions.submitBy",
            select: "firstName lastName name email role",
        },
        {
            path: "feedbacks.submitBy",
            select: "firstName lastName name email role",
        },
        {
            path: "applicationId",
            populate: { path: "courseId", select: "name" },
            match: Object.assign({ courseId: courseIdFilter ? courseIdFilter : { $in: courseIds } }, (termIdFilter && { intakeId: termIdFilter })),
        },
        { path: "unitId", select: "title" },
        { path: "unitMaterialId", select: "assignments" },
    ]), query)
        .search(assignment_constant_1.AssignmentSearchableFields)
        .filter(query)
        .sort()
        .fields()
        .paginate();
    // 3️⃣ Get all results
    const result = yield AssignmentQuery.modelQuery;
    // 4️⃣ Filter out assignments where applicationId is null
    const filteredResult = result.filter((a) => a.applicationId !== null);
    // 5️⃣ Handle limit and pagination properly
    const total = filteredResult.length;
    const page = Number(query.page) || 1;
    const limitParam = query.limit === "all" ? total : Number(query.limit) || 10;
    const paginatedResult = query.limit === "all"
        ? filteredResult
        : filteredResult.slice((page - 1) * limitParam, page * limitParam);
    const totalPage = limitParam > 0 ? Math.ceil(total / limitParam) : 1;
    const meta = { page, limit: limitParam, total, totalPage };
    return { meta, result: paginatedResult };
});
const getStudentAssignmentFeedbackFromDB = (studentId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const AssignmentQuery = new QueryBuilder_1.default(assignment_model_1.Assignment.find({
        studentId,
        status: { $in: ["feedback_given", "resubmission_required", "completed"] },
    }).populate([
        {
            path: "studentId",
            select: "firstName title initial lastName name email",
        },
        {
            path: "feedbacks.submitBy",
            select: "firstName lastName name email role", // who gave feedback
        },
        {
            path: "applicationId",
            populate: {
                path: "courseId",
                select: "name",
            },
        },
        {
            path: "unitId",
            select: "title",
        },
        {
            path: "unitMaterialId",
            select: "assignments",
        },
    ]), query)
        .search(assignment_constant_1.AssignmentSearchableFields)
        .filter(query)
        .sort()
        .fields()
        .paginate();
    const result = yield AssignmentQuery.modelQuery;
    // 🟢 Step 4: Filter out completed assignments that have all feedback seen
    // Step 4: Filter out completed assignments that have all feedback seen
    const filteredResult = result.filter((assignment) => {
        var _a;
        if (assignment.status === "completed") {
            // Check normal feedbacks
            const hasUnseenFeedback = (_a = assignment.feedbacks) === null || _a === void 0 ? void 0 : _a.some((fb) => !fb.seen);
            //  check finalFeedback
            const hasUnseenFinalFeedback = assignment.finalFeedback
                ? assignment.finalFeedback.seen === false
                : false;
            // Also check observationFeedback
            const hasUnseenObservationFeedback = assignment.observationFeedback
                ? assignment.observationFeedback.seen === false
                : false;
            return (hasUnseenFeedback ||
                hasUnseenFinalFeedback ||
                hasUnseenObservationFeedback);
        }
        return true;
    });
    // 🟢 Step 5: Handle limit and pagination manually (if `limit=all`)
    const total = filteredResult.length;
    const page = Number(query.page) || 1;
    const limitParam = query.limit === "all" ? total : Number(query.limit) || 10;
    const paginatedResult = query.limit === "all"
        ? filteredResult
        : filteredResult.slice((page - 1) * limitParam, page * limitParam);
    const totalPage = limitParam > 0 ? Math.ceil(total / limitParam) : 1;
    const meta = { page, limit: limitParam, total, totalPage };
    return { meta, result: paginatedResult };
});
// Students who submitted formative assignment
const getSubmittedAssignmentsFromDB = (courseId, termId, unitId, assignmentId, // this is courseMaterialAssignmentId
query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!courseId || !termId || !unitId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "courseId, termId, and unitId are required.");
    }
    // Get total number of enrolled students
    const totalApplications = yield applicationCourse_model_1.ApplicationCourse.countDocuments({
        courseId,
        intakeId: termId,
        status: "approved",
    });
    const assignments = yield assignment_model_1.Assignment.find({
        unitId,
        courseMaterialAssignmentId: assignmentId,
        status: { $in: ["submitted", "feedback_given", "completed"] },
    })
        .populate([
        { path: "studentId", select: "firstName lastName email" },
        { path: "unitId", select: "title" },
        {
            path: "applicationId",
            populate: [
                { path: "courseId", select: "name" },
                { path: "intakeId", select: "termName" },
            ],
            match: { courseId, intakeId: termId },
        },
    ])
        .lean();
    const filtered = assignments.filter((a) => a.applicationId);
    const result = filtered.map((a) => {
        var _a, _b, _c;
        return ({
            student: {
                _id: a.studentId._id,
                name: `${a.studentId.firstName} ${a.studentId.lastName}`,
                email: (_a = a.studentId) === null || _a === void 0 ? void 0 : _a.email,
            },
            applicationId: a.applicationId,
            course: (_b = a.applicationId) === null || _b === void 0 ? void 0 : _b.courseId,
            term: (_c = a.applicationId) === null || _c === void 0 ? void 0 : _c.intakeId,
            unit: a.unitId,
        });
    });
    const meta = {
        totalStudents: totalApplications,
        totalSubmitted: result.length,
    };
    return { meta, result };
});
// Students who did NOT submit formative assignment
const getNotSubmittedAssignmentsFromDB = (courseId, termId, unitId, assignmentId, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!courseId || !termId || !unitId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "courseId, termId, and unitId are required.");
    }
    // 1️⃣ Fetch all approved student applications
    const applications = yield applicationCourse_model_1.ApplicationCourse.find({
        courseId,
        intakeId: termId,
        status: "approved",
    })
        .populate("studentId", "firstName lastName email")
        .populate("courseId", "name")
        .populate("intakeId", "termName")
        .lean();
    if (!applications.length) {
        return {
            meta: { totalStudents: 0, totalNotSubmitted: 0, totalSubmitted: 0 },
            result: [],
        };
    }
    const applicationIds = applications.map((app) => app._id);
    // 2️⃣ Find all assignments that are considered "submitted"
    const submittedAssignments = yield assignment_model_1.Assignment.find({
        applicationId: { $in: applicationIds },
        unitId,
        courseMaterialAssignmentId: assignmentId,
        // Exclude "resubmission_required" even if requireResubmit = true
        $or: [
            {
                status: { $in: ["submitted", "feedback_given", "completed"] },
            },
            {
                // explicitly handle requireResubmit = false even if resubmission_required
                status: "resubmission_required",
                requireResubmit: false,
            },
        ],
    })
        .select("applicationId studentId unitId requireResubmit status")
        .populate("unitId", "title")
        .lean();
    // 3️⃣ Get IDs of students who have actually submitted
    const submittedStudentIds = new Set(submittedAssignments.map((a) => a.studentId.toString()));
    // 4️⃣ Filter out those who haven't submitted OR need resubmission
    const notSubmitted = applications.filter((app) => {
        const assignment = submittedAssignments.find((a) => a.studentId.toString() === app.studentId._id.toString());
        // Exclude if:
        // - No submission exists
        // - Or requireResubmit = true and status = "resubmission_required"
        if (!assignment)
            return true;
        if (assignment.requireResubmit && assignment.status === "resubmission_required") {
            return true;
        }
        return false;
    });
    // 5️⃣ Build final structured result
    const result = notSubmitted.map((app) => {
        var _a;
        return ({
            student: {
                _id: app.studentId._id,
                name: `${app.studentId.firstName} ${app.studentId.lastName}`,
                email: app.studentId.email,
            },
            applicationId: app,
            course: app.courseId,
            term: app.intakeId,
            unit: ((_a = submittedAssignments.find((sa) => { var _a; return ((_a = sa.unitId) === null || _a === void 0 ? void 0 : _a._id.toString()) === unitId.toString(); })) === null || _a === void 0 ? void 0 : _a.unitId) || { _id: unitId },
        });
    });
    // 6️⃣ Metadata summary
    const meta = {
        totalStudents: applications.length,
        totalSubmitted: submittedAssignments.length,
        totalNotSubmitted: result.length,
    };
    return { meta, result };
});
// Students who received feedback (with teacher)
const getFeedbackReceivedAssignmentsFromDB = (courseId, termId, unitId, assignmentId, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!courseId || !termId || !unitId || !assignmentId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Missing required parameters");
    }
    // ✅ Filter for fetching assignments (includes resubmissions for feedback)
    const submissionFilterWithResubmission = {
        unitId,
        courseMaterialAssignmentId: assignmentId,
        status: { $in: ["submitted", "feedback_given", "completed", "resubmission_required"] },
    };
    // ✅ Filter for counting submitted assignments (EXCLUDES resubmissions)
    const countFilter = {
        unitId,
        courseMaterialAssignmentId: assignmentId,
        status: { $in: ["submitted", "feedback_given", "completed"] }, // exclude resubmission_required
    };
    const totalApplications = yield applicationCourse_model_1.ApplicationCourse.countDocuments({
        courseId,
        intakeId: termId,
        status: "approved",
    });
    const totalSubmittedAssignments = yield assignment_model_1.Assignment.countDocuments(countFilter);
    // ✅ Count including resubmissions for calculating totalNoFeedback
    const totalSubmittedWithResubmission = yield assignment_model_1.Assignment.countDocuments(submissionFilterWithResubmission);
    const AssignmentQuery = new QueryBuilder_1.default(assignment_model_1.Assignment.find(submissionFilterWithResubmission).populate([
        { path: "studentId", select: "firstName lastName email" },
        { path: "unitId", select: "title" },
        { path: "feedbacks.submitBy", select: "firstName lastName name email role" },
        {
            path: "applicationId",
            populate: [
                { path: "courseId", select: "name" },
                { path: "intakeId", select: "termName" },
            ],
            match: { courseId, intakeId: termId },
        },
    ]), query)
        .filter(query)
        .sort()
        .fields()
        .paginate();
    const result = yield AssignmentQuery.modelQuery;
    const processed = result.map((assignment) => {
        var _a, _b, _c;
        (_a = assignment.submissions) === null || _a === void 0 ? void 0 : _a.sort((a, b) => (0, moment_1.default)(b.createdAt).valueOf() - (0, moment_1.default)(a.createdAt).valueOf());
        const latestSubmission = ((_b = assignment.submissions) === null || _b === void 0 ? void 0 : _b[0]) || null;
        (_c = assignment.feedbacks) === null || _c === void 0 ? void 0 : _c.sort((a, b) => (0, moment_1.default)(b.createdAt).valueOf() - (0, moment_1.default)(a.createdAt).valueOf());
        const latestFeedback = latestSubmission
            ? assignment.feedbacks.find((f) => (0, moment_1.default)(f.createdAt).isAfter((0, moment_1.default)(latestSubmission.createdAt)))
            : null;
        assignment.latestSubmission = latestSubmission;
        assignment.latestFeedback = latestFeedback || null;
        return assignment;
    });
    const withFeedback = processed.filter((a) => a.latestFeedback !== null);
    const meta = {
        totalStudents: totalApplications,
        totalAssignmentSubmission: totalSubmittedAssignments,
        totalFeedback: withFeedback.length,
        totalNoFeedback: totalSubmittedWithResubmission - withFeedback.length, // include resubmissions
    };
    return { meta, result: withFeedback };
});
// Students WITHOUT feedback
const getNoFeedbackAssignmentsFromDB = (courseId, termId, unitId, assignmentId, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!courseId || !termId || !unitId || !assignmentId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Missing required parameters");
    }
    // ✅ Filter for counting submitted assignments (EXCLUDES resubmissions)
    const countFilter = {
        unitId,
        courseMaterialAssignmentId: assignmentId,
        status: { $in: ["submitted", "feedback_given", "completed"] }, // exclude resubmission_required
    };
    // ✅ Filter for fetching assignments (INCLUDES resubmissions for feedback check)
    const submissionFilterWithResubmission = {
        unitId,
        courseMaterialAssignmentId: assignmentId,
        status: { $in: ["submitted", "feedback_given", "completed", "resubmission_required"] },
    };
    // ✅ Step 1: Total enrolled students
    const totalApplications = yield applicationCourse_model_1.ApplicationCourse.countDocuments({
        courseId,
        intakeId: termId,
        status: "approved",
    });
    // ✅ Step 2: Total submitted assignments (exclude resubmissions)
    const totalSubmittedAssignments = yield assignment_model_1.Assignment.countDocuments(countFilter);
    // ✅ Step 3: Total submitted assignments including resubmissions (for totalNoFeedback)
    const totalSubmittedWithResubmission = yield assignment_model_1.Assignment.countDocuments(submissionFilterWithResubmission);
    // ✅ Step 4: Fetch assignments for processing feedback
    const AssignmentQuery = new QueryBuilder_1.default(assignment_model_1.Assignment.find(submissionFilterWithResubmission).populate([
        { path: "studentId", select: "firstName lastName email" },
        { path: "unitId", select: "title" },
        { path: "feedbacks.submitBy", select: "firstName lastName name email role" },
        {
            path: "applicationId",
            populate: [
                { path: "courseId", select: "name" },
                { path: "intakeId", select: "termName" },
            ],
            match: { courseId, intakeId: termId },
        },
    ]), query)
        .filter(query)
        .sort()
        .fields()
        .paginate();
    const result = yield AssignmentQuery.modelQuery;
    // ✅ Step 5: Process and find which have feedback after latest submission
    const processed = result.map((assignment) => {
        var _a, _b, _c;
        (_a = assignment.submissions) === null || _a === void 0 ? void 0 : _a.sort((a, b) => (0, moment_1.default)(b.createdAt).valueOf() - (0, moment_1.default)(a.createdAt).valueOf());
        const latestSubmission = ((_b = assignment.submissions) === null || _b === void 0 ? void 0 : _b[0]) || null;
        (_c = assignment.feedbacks) === null || _c === void 0 ? void 0 : _c.sort((a, b) => (0, moment_1.default)(b.createdAt).valueOf() - (0, moment_1.default)(a.createdAt).valueOf());
        const hasFeedbackAfterSubmission = latestSubmission
            ? assignment.feedbacks.some((f) => (0, moment_1.default)(f.createdAt).isAfter((0, moment_1.default)(latestSubmission.createdAt)))
            : false;
        assignment.latestSubmission = latestSubmission;
        assignment.hasFeedbackAfterSubmission = hasFeedbackAfterSubmission;
        return assignment;
    });
    // ✅ Step 6: Keep only those with NO feedback after submission
    const withoutFeedback = processed.filter((a) => !a.hasFeedbackAfterSubmission);
    // ✅ Step 7: Meta summary
    const meta = {
        totalStudents: totalApplications,
        totalAssignmentSubmission: totalSubmittedAssignments,
        totalNoFeedback: totalSubmittedWithResubmission - (totalSubmittedWithResubmission - withoutFeedback.length),
        totalFeedback: totalSubmittedWithResubmission - withoutFeedback.length, // include feedback on resubmissions
    };
    return { meta, result: withoutFeedback };
});
exports.AssignmentServices = {
    getAllAssignmentFromDB,
    getSingleAssignmentFromDB,
    updateAssignmentIntoDB,
    createAssignmentIntoDB,
    getTeacherAssignmentFeedbackFromDB,
    getStudentAssignmentFeedbackFromDB,
    getSubmittedAssignmentsFromDB,
    getNotSubmittedAssignmentsFromDB,
    getFeedbackReceivedAssignmentsFromDB,
    getNoFeedbackAssignmentsFromDB,
};
