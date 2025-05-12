"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_router_1 = require("../modules/auth/auth.router");
const notification_route_1 = require("../modules/notification/notification.route");
const documents_route_1 = require("../modules/documents/documents.route");
const application_route_1 = require("../modules/applications/application.route");
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
        path: "/applications",
        route: application_route_1.ApplicationRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
