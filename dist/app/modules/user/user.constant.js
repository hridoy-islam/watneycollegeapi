"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSearchableFields = exports.UserStatus = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    user: "user",
    admin: "admin",
    company: "company",
    creator: "creator",
    director: "director",
    student: "student",
    applicant: "applicant"
};
exports.UserStatus = ["block", "active"];
exports.UserSearchableFields = ["email", "name", "role"];
