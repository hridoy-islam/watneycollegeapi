import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { ApplicationCourse } from "./applicationCourse.model";
import { TApplicationCourse } from "./applicationCourse.interface";
import { ApplicationCourseSearchableFields } from "./applicationCourse.constant";
import { sendEmail } from "../../utils/sendEmail";
import moment from "moment";
import Course from "../course/course.model";
import { sendEmailUpdateCourse } from "../../utils/sendEmailUpdateCourse";
import { sendEmailAdminCourse } from "../../utils/sendEmailAdminCourse";

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

const generateRefId = async (courseId: string): Promise<string> => {
  const course = await Course.findById(courseId).select("courseCode");
  if (!course || !course.courseCode) {
    throw new Error("Invalid course or courseCode not found");
  }

  const now = moment();
  const yy = now.format("YY"); // last 2 digits of year
  const mm = now.format("MM"); // month
  const courseCode = course.courseCode;

  // Month boundaries
  const startOfMonth = now.clone().startOf("month").toDate();
  const endOfMonth = now.clone().endOf("month").toDate();

  // Find the latest application for this course in this month
  const lastApplication = await ApplicationCourse.findOne({
    courseId,
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  })
    .sort({ createdAt: -1 })
    .select("refId");

  // Initial serial number
  let serialNumber = 1;
  if (lastApplication?.refId) {
    const lastSerialStr = lastApplication.refId.slice(-3); // last 3 digits
    const lastSerial = parseInt(lastSerialStr, 10);
    serialNumber = isNaN(lastSerial) ? 1 : lastSerial + 1;
  }

  let refId: string;
  let exists = true;

  // Loop until a unique refId is found
  while (exists) {
    const serial = String(serialNumber).padStart(3, "0");
    refId = `WC${yy}${mm}${courseCode}${serial}`;

    // Check if this refId already exists
    exists = !!(await ApplicationCourse.exists({ refId }));
    if (exists) {
      serialNumber++; // increment and try again
    }
  }

  return refId!;
};

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
    .filter(query)
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
  const result = await ApplicationCourse.findById(id)
    .populate({
      path: "studentId",
      select: "title firstName initial lastName email phone studentType",
    })
    .populate("intakeId")
    .populate("courseId");
  return result;
};

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

const updateApplicationCourseIntoDB = async (
  id: string,
  payload: Partial<TApplicationCourse>
) => {
  // Step 1: Fetch the current application course with populated data
  const applicationCourse = await ApplicationCourse.findById(id)
    .populate("courseId", "name") // assuming courseId refs a Course model with 'name'
    .populate("intakeId", "termName") // assuming intakeId refs an Intake model with 'termName'
    .populate("studentId", "name email phone"); // assuming studentId refs a Student model

  if (!applicationCourse) {
    throw new AppError(httpStatus.NOT_FOUND, "ApplicationCourse not found");
  }

  const previousCourseName = (applicationCourse.courseId as any)?.name || "";

  // Step 2: Perform the update
  const updatedApplicationCourse = await ApplicationCourse.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("courseId", "name")
    .populate("intakeId", "termName")
    .populate("studentId", "name email phone");

  if (!updatedApplicationCourse) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update ApplicationCourse"
    );
  }

  // Step 3: Extract data for email
  const { studentId, courseId, intakeId } = updatedApplicationCourse;

  const emailData = {
    studentName: (studentId as any)?.name,
    studentEmail: (studentId as any)?.email,
    courseName: (courseId as any)?.name,
    termName: (intakeId as any)?.termName,
    previousCourseName,
  };

  // Step 4: Send email notification
  try {
    await sendEmailUpdateCourse(
      emailData.studentEmail,
      "course-change",
      "Your Application Details Have Been Updated",
      emailData.studentName,
      emailData.studentEmail,
      emailData.courseName,
      emailData.termName,
      previousCourseName
    );
  } catch (emailError) {
    console.warn("Failed to send update email:", emailError);
  }

  try {
    await sendEmailAdminCourse(
      "admissions@watneycollege.co.uk",
      "course-change-admin",
      "Student Application Course Updated",
      emailData.studentName,
      emailData.studentEmail,
      emailData.courseName,
      emailData.termName,
      emailData.previousCourseName,
    );
  } catch (adminEmailError) {
    console.warn("Failed to send admin notification email:", adminEmailError);
  }

  return updatedApplicationCourse;
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
  const refId = await generateRefId(courseId.toString());

  const result = await ApplicationCourse.create({ ...payload, refId });
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

  const title = (populatedResult?.courseId as any)?.name;
  const applicantName = (populatedResult?.studentId as any)?.name;
  const applicantEmail = (populatedResult?.studentId as any)?.email;
  const adminSubject = `New Enrollment Submission for ${title}`;
  const emailSubject = `Thank You for Applying to Watney College`;
  const otp = "";
  const termName = (populatedResult?.intakeId as any)?.termName;
  const studentType = (populatedResult?.studentId as any)?.studentType;
  const phone = (populatedResult?.studentId as any)?.phone;
  const countryOfResidence = (populatedResult?.studentId as any)
    ?.countryOfResidence;
  const studentStatus =
    studentType === "eu" ? "Home Student" : "International Student";
  const dob = (populatedResult?.studentId as any)?.dateOfBirth;

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
    "course-register-admin",
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
