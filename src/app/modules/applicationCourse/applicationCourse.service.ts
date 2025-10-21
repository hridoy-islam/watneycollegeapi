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
import { User } from "../user/user.model";

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
  const { searchTerm, ...otherQueryParams } = query;

  let studentIds: any = [];

  // If searchTerm is provided, search in User model first
  if (searchTerm) {
    // Create search conditions for different name combinations
    const nameSearchConditions = [];
    
    // Split search term into parts for name combination searches
    const searchTerms = String(searchTerm).trim().split(/\s+/);
    
    if (searchTerms.length === 1) {
      // Single term - search in individual fields
      const term = searchTerms[0];
      nameSearchConditions.push(
        { email: { $regex: term, $options: "i" } },
        { firstName: { $regex: term, $options: "i" } },
        { lastName: { $regex: term, $options: "i" } },
        { title: { $regex: term, $options: "i" } },
        { initial: { $regex: term, $options: "i" } },
        { name: { $regex: term, $options: "i" } }
      );
    } else if (searchTerms.length === 2) {
      // Two terms - could be "firstName lastName", "title firstName", etc.
      const [first, second] = searchTerms;
      
      // Try different combinations
      nameSearchConditions.push(
        // firstName + lastName
        {
          $and: [
            { firstName: { $regex: first, $options: "i" } },
            { lastName: { $regex: second, $options: "i" } }
          ]
        },
        // title + firstName
        {
          $and: [
            { title: { $regex: first, $options: "i" } },
            { firstName: { $regex: second, $options: "i" } }
          ]
        },
        // firstName + initial
        {
          $and: [
            { firstName: { $regex: first, $options: "i" } },
            { initial: { $regex: second, $options: "i" } }
          ]
        }
      );
    } else if (searchTerms.length === 3) {
      // Three terms - could be "title firstName lastName", "firstName initial lastName", etc.
      const [first, second, third] = searchTerms;
      
      nameSearchConditions.push(
        // title + firstName + lastName
        {
          $and: [
            { title: { $regex: first, $options: "i" } },
            { firstName: { $regex: second, $options: "i" } },
            { lastName: { $regex: third, $options: "i" } }
          ]
        },
        // firstName + initial + lastName
        {
          $and: [
            { firstName: { $regex: first, $options: "i" } },
            { initial: { $regex: second, $options: "i" } },
            { lastName: { $regex: third, $options: "i" } }
          ]
        }
      );
    } else if (searchTerms.length >= 4) {
      // Four or more terms - try title + firstName + initial + lastName combination
      const [first, second, third, fourth] = searchTerms;
      
      nameSearchConditions.push(
        {
          $and: [
            { title: { $regex: first, $options: "i" } },
            { firstName: { $regex: second, $options: "i" } },
            { initial: { $regex: third, $options: "i" } },
            { lastName: { $regex: fourth, $options: "i" } }
          ]
        }
      );
    }

    // Also search for the original full search term in individual fields
    nameSearchConditions.push(
      { email: { $regex: searchTerm, $options: "i" } },
      { firstName: { $regex: searchTerm, $options: "i" } },
      { lastName: { $regex: searchTerm, $options: "i" } },
      { title: { $regex: searchTerm, $options: "i" } },
      { initial: { $regex: searchTerm, $options: "i" } },
      { name: { $regex: searchTerm, $options: "i" } }
    );

    const userQuery = new QueryBuilder(
      User.find({
        $or: nameSearchConditions
      }),
      {}
    ).fields();

    const matchingUsers = await userQuery.modelQuery;
    studentIds = matchingUsers.map((user) => user._id);
  }

  // Build the main ApplicationCourse query
  let applicationCourseQuery;

  if (searchTerm && studentIds.length > 0) {
    // If we have matching student IDs, search by studentId
    applicationCourseQuery = new QueryBuilder(
      ApplicationCourse.find({
        studentId: { $in: studentIds },
      })
        .populate({
          path: "studentId",
          select: "title firstName initial lastName email phone studentType",
        })
        .populate("intakeId")
        .populate("courseId"),
      otherQueryParams
    )
      .filter(otherQueryParams)
      .sort()
      .paginate()
      .fields();
  } else if (searchTerm && studentIds.length === 0) {
    // If searchTerm provided but no matching users found, return empty result
    applicationCourseQuery = new QueryBuilder(
      ApplicationCourse.find({ _id: null }) // Force no results
        .populate({
          path: "studentId",
          select: "title firstName initial lastName email phone studentType",
        })
        .populate("intakeId")
        .populate("courseId"),
      otherQueryParams
    )
      .filter(otherQueryParams)
      .sort()
      .paginate()
      .fields();
  } else {
    // Normal query without searchTerm
    applicationCourseQuery = new QueryBuilder(
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
  }

  const meta = await applicationCourseQuery.countTotal();
  const result = await applicationCourseQuery.modelQuery;

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
  // Step 1: Fetch the current course with populations
  const applicationCourse = await ApplicationCourse.findById(id)
    .populate("courseId", "name")
    .populate("intakeId", "termName")
    .populate("studentId", "name email phone");

  if (!applicationCourse) {
    throw new AppError(httpStatus.NOT_FOUND, "ApplicationCourse not found");
  }

  const previousCourseId = applicationCourse.courseId?._id?.toString?.();
  const previousCourseName = (applicationCourse.courseId as any)?.name || "";

  // Step 2: Apply updates
  if (payload.courseId && payload.courseId.toString() !== previousCourseId) {
    // courseId changed → generate new refId
    const newRefId = await generateRefId(payload.courseId.toString());
    payload.refId = newRefId;
  }

  // Merge updates into the doc
  Object.assign(applicationCourse, payload);
  await applicationCourse.save();

  // Re-populate to get fresh course/intake/student data
  await applicationCourse.populate([
    { path: "courseId", select: "name" },
    { path: "intakeId", select: "termName" },
    { path: "studentId", select: "name email phone" },
  ]);

  const { studentId, courseId, intakeId } = applicationCourse;

  // Step 3: Prepare email data
  const emailData = {
    studentName: (studentId as any)?.name,
    studentEmail: (studentId as any)?.email,
    courseName: (courseId as any)?.name,
    termName: (intakeId as any)?.termName,
    previousCourseName,
  };

  // Step 4: Send emails
  try {
    await sendEmailUpdateCourse(
      emailData.studentEmail,
      "course-change",
      "Your Application Details Have Been Updated",
      emailData.studentName,
      emailData.studentEmail,
      emailData.courseName,
      emailData.termName,
      emailData.previousCourseName
    );
  } catch (err) {
    console.warn("Failed to send update email:", err);
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
      emailData.previousCourseName
    );
  } catch (err) {
    console.warn("Failed to send admin email:", err);
  }

  // ✅ Return updated doc
  return applicationCourse;
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
