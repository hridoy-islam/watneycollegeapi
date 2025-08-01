import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { ApplicationCourse } from "./applicationCourse.model";
import { TApplicationCourse } from "./applicationCourse.interface";
import { ApplicationCourseSearchableFields } from "./applicationCourse.constant";
import { sendEmail } from "../../utils/sendEmail";
import moment from "moment";

const getAllApplicationCourseFromDB = async (
  query: Record<string, unknown>
) => {
  const ApplicationCourseQuery = new QueryBuilder(
    ApplicationCourse.find()
      .populate({
        path: "studentId",
        select: "title firstName initial lastName email phone studentType",
      })
      .populate("intakeId")
      .populate("courseId"),
    query
  )
    .search(ApplicationCourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await ApplicationCourseQuery.countTotal();
  const result = await ApplicationCourseQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleApplicationCourseFromDB = async (id: string) => {
  const result = await ApplicationCourse.findById(id);
  return result;
};

const updateApplicationCourseIntoDB = async (
  id: string,
  payload: Partial<TApplicationCourse>
) => {
  const applicationCourse = await ApplicationCourse.findById(id);
  if (!applicationCourse) {
    throw new AppError(httpStatus.NOT_FOUND, "ApplicationCourse not found");
  }

  const result = await ApplicationCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const createApplicationCourseIntoDB = async (
  payload: Partial<TApplicationCourse>
) => {
  const { courseId, intakeId, studentId } = payload;

  // Ensure all required fields are provided
  if (!courseId || !intakeId || !studentId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Missing required fields: courseId, intakeId, and studentId are all required"
    );
  }

  // Check if an application already exists with the same course, student, and intake
  const existingApplication = await ApplicationCourse.findOne({
    courseId,
    intakeId,
    studentId,
  });

  if (existingApplication) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already applied for this course with the selected intake."
    );
  }

  const result = await ApplicationCourse.create(payload);
  if (!result || !result._id) {
    throw new Error("Course creation failed");
  }

  const populatedResult = await ApplicationCourse.findById(result._id)
    .populate("courseId", "name")
    .populate("intakeId", "termName")
    .populate<{ name: string; email: string }>(
      "studentId",
      "name email studentType phone countryOfResidence dateOfBirth"
    );

  if (!populatedResult) {
    throw new Error("Failed to populate course application");
  }

  const title = populatedResult?.courseId?.name;
  const applicantName = populatedResult?.studentId?.name;
  const applicantEmail = populatedResult?.studentId?.email;
  const adminSubject = `New Enrollment Submission for ${title}`;
  const emailSubject = `Thank You for Applying to ${title}`;
  const otp = "";
  const termName = populatedResult?.intakeId?.termName;
  const studentType = populatedResult?.studentId?.studentType;
  const phone = populatedResult?.studentId?.phone;
  const countryOfResidence = populatedResult?.studentId?.countryOfResidence;
  const studentStatus =
    studentType === "eu" ? "Home Student" : "International Student";
  const dob = populatedResult?.studentId?.dateOfBirth;

  const formattedDob = dob ? moment(dob).format("DD MMM, YYYY") : "N/A";
  await sendEmail(
    applicantEmail,
    "course-register",
    emailSubject,
    applicantName,
    otp,
    title
  );

  await sendEmail(
    "admission@watneycollege.co.uk",
    "course-register-notification",
    adminSubject,
    applicantName,
    otp,
    title,
    applicantEmail,
    termName,
    studentStatus,
    phone,
    countryOfResidence,
    formattedDob
  );

  return result;
};

export const ApplicationCourseServices = {
  getAllApplicationCourseFromDB,
  getSingleApplicationCourseFromDB,
  updateApplicationCourseIntoDB,
  createApplicationCourseIntoDB,
};
