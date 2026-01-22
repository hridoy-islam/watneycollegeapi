"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_router_1 = require("../modules/auth/auth.router");
const notification_route_1 = require("../modules/notification/notification.route");
const documents_route_1 = require("../modules/documents/documents.route");
const jobApplication_route_1 = require("../modules/jobApplications/jobApplication.route");
const term_route_1 = require("../modules/term/term.route");
const course_route_1 = require("../modules/course/course.route");
const job_route_1 = require("../modules/job/job.route");
const email_drafts_route_1 = require("../modules/email-drafts/email-drafts.route");
const email_route_1 = require("../modules/email/email.route");
const signature_route_1 = require("../modules/signature/signature.route");
const applicationCourse_route_1 = require("../modules/applicationCourse/applicationCourse.route");
const assignment_route_1 = require("../modules/assignment/assignment.route");
const courseUnit_route_1 = require("../modules/courseUnit/courseUnit.route");
const courseUnitMaterial_route_1 = require("../modules/courseUnitMaterial/courseUnitMaterial.route");
const courseDocument_route_1 = require("../modules/courseDocument/courseDocument.route");
const teacherCourse_route_1 = require("../modules/teacherCourse/teacherCourse.route");
const logs_route_1 = require("../modules/logs/logs.route");
const verify_route_1 = require("../modules/verify/verify.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_router_1.AuthRoutes,
    },
    {
        path: "/notifications",
        route: notification_route_1.NotificationsRoutes,
    },
    {
        path: "/documents",
        route: documents_route_1.UploadDocumentRoutes,
    },
    {
        path: "/application-job",
        route: jobApplication_route_1.JobApplicationRoutes,
    },
    {
        path: "/terms",
        route: term_route_1.TermRoutes,
    },
    {
        path: "/courses",
        route: course_route_1.CourseRoutes,
    },
    {
        path: "/application-course",
        route: applicationCourse_route_1.ApplicationCourseRoutes,
    },
    {
        path: "/jobs",
        route: job_route_1.JobRoutes,
    },
    {
        path: "/email-drafts",
        route: email_drafts_route_1.EmailDraftRoutes,
    },
    {
        path: "/email",
        route: email_route_1.EmailRoutes,
    },
    {
        path: "/signature",
        route: signature_route_1.SignatureRoutes,
    },
    {
        path: "/assignment",
        route: assignment_route_1.AssignmentRoutes,
    },
    {
        path: "/course-unit",
        route: courseUnit_route_1.CourseUnitRoutes,
    },
    {
        path: "/unit-material",
        route: courseUnitMaterial_route_1.CourseUnitMaterialRoutes,
    },
    {
        path: "/course-document",
        route: courseDocument_route_1.CourseDocumentRoutes,
    },
    {
        path: "/teacher-courses",
        route: teacherCourse_route_1.TeacherCourseRoutes,
    },
    {
        path: "/logs",
        route: logs_route_1.LogsRoutes,
    },
    {
        path: "/verification",
        route: verify_route_1.VerifyRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
