export const USER_ROLE = {
  user: "user",
  admin: "admin",
  company: "company",
  creator: "creator",
  director: "director",
  student: "student",
  applicant: "applicant"
} as const;

export const UserStatus = ["block", "active"];

export const UserSearchableFields = ["email", "name", "role"];
