import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.router";

import { NotificationsRoutes } from "../modules/notification/notification.route";
import { UploadDocumentRoutes } from "../modules/documents/documents.route";
import { JobApplicationRoutes } from "../modules/jobApplications/jobApplication.route";
import { TermRoutes } from "../modules/term/term.route";
import { CourseRoutes } from "../modules/course/course.route";
import { ApplicationCourseRoutes } from "../modules/applicationCourse/applicationCourse.route";
import { JobRoutes } from "../modules/job/job.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },

  {
    path: "/notifications",
    route: NotificationsRoutes,
  },
  {
    path: "/documents",
    route: UploadDocumentRoutes,
  },
  {
    path: "/application-job",
    route: JobApplicationRoutes,
  },
  {
    path: "/terms",
    route: TermRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/application-course",
    route: ApplicationCourseRoutes,
  },
  {
    path: "/jobs",
    route: JobRoutes,
  },
 
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
