import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";

import { EmailSearchableFields } from "./email.constant";
import { TEmail } from "./email.interface";
import Email from "./email.model";
import { sendEmailManual } from "../../utils/sendEmailManual";
import { User } from "../user/user.model";

import moment from "moment";
import Course from "../course/course.model";
import { ApplicationCourse } from "../applicationCourse/applicationCourse.model";
import CourseCode from "../course-code/course-code.model";
import Signature from "../signature/signature.model";

// const createEmailIntoDB = async (payload: any) => {
//   try {
//     const {
//       emailDraft,
//       userId,
//       issuedBy,
//       subject: emailSubject,
//       body: emailBody,
//       applicationId,
//     } = payload;

//     // Find user
//     const foundUser = await User.findById(userId);
//     if (!foundUser) {
//       throw new AppError(httpStatus.NOT_FOUND, "User not found");
//     }

//     // Fetch course name if applicationId is provided
//     let courseName = "";
//     let intake = "";
//     let applicationStatus = "";
//     let applicationDate = "";

//     if (applicationId) {
//       const application = await ApplicationCourse.findById(applicationId)
//         .populate("courseId")
//         .populate("intakeId");
//       courseName = (application?.courseId as any)?.name || "";
//       intake = (application?.intakeId as any)?.termName || "";
//       applicationStatus = application?.status || "";
//       applicationDate = application?.createdAt
//         ? moment(application.createdAt).format("DD MMM, YYYY")
//         : "";
//     }

//     // Helper to replace variables
//     const replaceVariable = (text: string): string => {
//       return text
//         .replace(/\[admin\]/g, "Watney College")
//         .replace(/\[adminEmail\]/g, "info@watneycollege.co.uk")
//         .replace(/\[courseName\]/g, courseName)
//         .replace(/\[intake\]/g, intake)
//         .replace(/\[applicationStatus\]/g, applicationStatus)
//         .replace(/\[applicationDate\]/g, applicationDate)
//         .replace(/\[name\]/g, foundUser.name || "")
//         .replace(/\[title\]/g, foundUser.title || "")
//         .replace(/\[firstName\]/g, foundUser.firstName || "")
//         .replace(/\[lastName\]/g, foundUser.lastName || "")
//         .replace(/\[phone\]/g, foundUser.phone || "")
//         .replace(
//           /\[dateOfBirth\]/g,
//           foundUser.dateOfBirth
//             ? moment(foundUser.dateOfBirth).format("DD MMM, YYYY")
//             : ""
//         )
//         .replace(/\[email\]/g, foundUser.email || "")
//         .replace(/\[countryOfBirth\]/g, foundUser.countryOfBirth || "")
//         .replace(/\[nationality\]/g, foundUser.nationality || "")
//         .replace(/\[countryOfResidence\]/g, foundUser.countryOfResidence || "")
//         .replace(/\[ethnicity\]/g, foundUser.ethnicity || "")
//         .replace(/\[gender\]/g, foundUser.gender || "")
//         .replace(/\[postalAddressLine1\]/g, foundUser.postalAddressLine1 || "")
//         .replace(/\[postalAddressLine2\]/g, foundUser.postalAddressLine2 || "")
//         .replace(/\[postalCity\]/g, foundUser.postalCity || "")
//         .replace(/\[postalCountry\]/g, foundUser.postalCountry || "")
//         .replace(/\[postalPostCode\]/g, foundUser.postalPostCode || "")
//         .replace(
//           /\[residentialAddressLine1\]/g,
//           foundUser.residentialAddressLine1 || ""
//         )
//         .replace(
//           /\[residentialAddressLine2\]/g,
//           foundUser.residentialAddressLine2 || ""
//         )
//         .replace(/\[residentialCity\]/g, foundUser.residentialCity || "")
//         .replace(/\[residentialCountry\]/g, foundUser.residentialCountry || "")
//         .replace(
//           /\[residentialPostCode\]/g,
//           foundUser.residentialPostCode || ""
//         )
//         .replace(/\[emergencyAddress\]/g, foundUser.emergencyAddress || "")
//         .replace(
//           /\[emergencyContactNumber\]/g,
//           foundUser.emergencyContactNumber || ""
//         )
//         .replace(/\[emergencyEmail\]/g, foundUser.emergencyEmail || "")
//         .replace(/\[emergencyFullName\]/g, foundUser.emergencyFullName || "")
//         .replace(
//           /\[emergencyRelationship\]/g,
//           foundUser.emergencyRelationship || ""
//         )
//         .replace(
//           /\[applicationLocation\]/g,
//           foundUser.applicationLocation || ""
//         );
//     };

//     // Replace variables in subject and body
//     const processedSubject = replaceVariable(emailSubject);
//     const processedBody = replaceVariable(emailBody);

//     // Save email with processed body (plain text with variables replaced)
//     const result = await Email.create({
//       ...payload,
//       subject: processedSubject,
//       body: processedBody, // Already replaced
//     });

//     // Send email (with <br/> for line breaks)
//     const htmlBody = processedBody.replace(/\n/g, "<br/>");
//     await sendEmailManual(
//       foundUser.email,
//       "custom_template",
//       processedSubject,
//       htmlBody
//     );

//     // Update status to 'sent'
//     const updatedEmail = await Email.findByIdAndUpdate(
//       result._id,
//       { status: "sent" },
//       { new: true, runValidators: true }
//     );

//     return updatedEmail;
//   } catch (error: any) {
//     console.error("Error in createEmailIntoDB:", error);

//     if (error instanceof AppError) {
//       throw error;
//     }

//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       error.message || "Failed to create or send email"
//     );
//   }
// };



const createEmailIntoDB = async (payload: any) => {
  try {
    const {
      emailDraft,
      userId,
      issuedBy,
      subject: emailSubject,
      body: emailBody,
      applicationId,
    } = payload;

    // Find user
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Fetch course name if applicationId is provided
    let courseName = "";
    let intake = "";
    let applicationStatus = "";
    let applicationDate = "";

    if (applicationId) {
      const application = await ApplicationCourse.findById(applicationId)
        .populate("courseId")
        .populate("intakeId");
      courseName = (application?.courseId as any)?.name || "";
      intake = (application?.intakeId as any)?.termName || "";
      applicationStatus = application?.status || "";
      applicationDate = application?.createdAt
        ? moment(application.createdAt).format("DD MMM, YYYY")
        : "";
    }

    // Enhanced helper to replace all variables including dynamic ones
    const replaceVariables = async (text: string): Promise<string> => {
      let replacedText = text;

      // 1. Replace basic variables
      replacedText = replacedText
        .replace(/\[admin\]/g, "Watney College")
        .replace(/\[adminEmail\]/g, "info@watneycollege.co.uk")
        .replace(/\[courseName\]/g, courseName)
        .replace(/\[intake\]/g, intake)
        .replace(/\[applicationStatus\]/g, applicationStatus)
        .replace(/\[applicationDate\]/g, applicationDate)
        .replace(/\[todayDate\]/g, moment().format("DD MMM, YYYY"))
        .replace(/\[name\]/g, foundUser.name || "")
        .replace(/\[title\]/g, foundUser.title || "")
        .replace(/\[firstName\]/g, foundUser.firstName || "")
        .replace(/\[lastName\]/g, foundUser.lastName || "")
        .replace(/\[phone\]/g, foundUser.phone || "")
        .replace(
          /\[dateOfBirth\]/g,
          foundUser.dateOfBirth
            ? moment(foundUser.dateOfBirth).format("DD MMM, YYYY")
            : ""
        )
        .replace(/\[email\]/g, foundUser.email || "")
        .replace(/\[countryOfBirth\]/g, foundUser.countryOfBirth || "")
        .replace(/\[nationality\]/g, foundUser.nationality || "")
        .replace(/\[countryOfResidence\]/g, foundUser.countryOfResidence || "")
        .replace(/\[ethnicity\]/g, foundUser.ethnicity || "")
        .replace(/\[gender\]/g, foundUser.gender || "")
        .replace(/\[postalAddressLine1\]/g, foundUser.postalAddressLine1 || "")
        .replace(/\[postalAddressLine2\]/g, foundUser.postalAddressLine2 || "")
        .replace(/\[postalCity\]/g, foundUser.postalCity || "")
        .replace(/\[postalCountry\]/g, foundUser.postalCountry || "")
        .replace(/\[postalPostCode\]/g, foundUser.postalPostCode || "")
        .replace(
          /\[residentialAddressLine1\]/g,
          foundUser.residentialAddressLine1 || ""
        )
        .replace(
          /\[residentialAddressLine2\]/g,
          foundUser.residentialAddressLine2 || ""
        )
        .replace(/\[residentialCity\]/g, foundUser.residentialCity || "")
        .replace(/\[residentialCountry\]/g, foundUser.residentialCountry || "")
        .replace(
          /\[residentialPostCode\]/g,
          foundUser.residentialPostCode || ""
        )
        .replace(/\[emergencyAddress\]/g, foundUser.emergencyAddress || "")
        .replace(
          /\[emergencyContactNumber\]/g,
          foundUser.emergencyContactNumber || ""
        )
        .replace(/\[emergencyEmail\]/g, foundUser.emergencyEmail || "")
        .replace(/\[emergencyFullName\]/g, foundUser.emergencyFullName || "")
        .replace(
          /\[emergencyRelationship\]/g,
          foundUser.emergencyRelationship || ""
        )
        .replace(
          /\[applicationLocation\]/g,
          foundUser.applicationLocation || ""
        );

      // 2. Handle [signature id="1"] tags → Replace with <img> tag
      const signatureRegex = /\[signature\s+id=["'](\d+)["']\]/g;
      const signatureMatches = [...replacedText.matchAll(signatureRegex)];

      const signaturePromises = signatureMatches.map(async (match) => {
        const signatureId = match[1];
        const placeholder = match[0];

        try {
          const signature = await Signature.findOne({ signatureId: signatureId });
          const url = signature?.documentUrl;

          if (url) {
            // ✅ Replace with <img> tag for rendering in email
            return {
              placeholder,
              replacement: `<img src="${url}" alt="Signature" style="max-width: 150px; margin: 10px 0;" />`,
            };
          }
          return { placeholder, replacement: "" };
        } catch (error) {
          console.error(`Error fetching signature ${signatureId}:`, error);
          return { placeholder, replacement: "" };
        }
      });

      // 3. Handle [courseCode="LEVEL25"] tags
      const courseCodeRegex = /\[courseCode=["']([^"']+)["']\]/g;
      const courseCodeMatches = [...replacedText.matchAll(courseCodeRegex)];

      const courseCodePromises = courseCodeMatches.map(async (match) => {
        const courseCode = match[1];
        const placeholder = match[0];

        try {
          const course = await CourseCode.findOne({ courseCode: courseCode }).populate('course');
          const courseName =( course?.course as any)?.name;

          return {
            placeholder,
            replacement: courseName || courseCode,
          };
        } catch (error) {
          console.error(`Error fetching course ${courseCode}:`, error);
          return { placeholder, replacement: courseCode };
        }
      });

      // 4. Wait for all async replacements and apply them
      const allPromises = [...signaturePromises, ...courseCodePromises];

      if (allPromises.length > 0) {
        const replacements = await Promise.all(allPromises);

        // Apply all replacements to the text
        replacements.forEach(({ placeholder, replacement }) => {
          replacedText = replacedText.replace(new RegExp(escapeRegExp(placeholder), 'g'), replacement);
        });
      }

      return replacedText;
    };

    // Helper function to escape special regex characters
    const escapeRegExp = (string: string): string => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // Replace variables in subject and body
    const processedSubject = await replaceVariables(emailSubject);
    const processedBody = await replaceVariables(emailBody);

    // Save email with processed body (plain text with variables replaced)
    const result = await Email.create({
      ...payload,
      subject: processedSubject,
      body: processedBody, // Already replaced
    });

    // ✅ Convert newlines to <br> and render HTML (important!)
    const htmlBody = processedBody.replace(/\n/g, "<br/>");
    await sendEmailManual(
      foundUser.email,
      "custom_template",
      processedSubject,
      htmlBody // This will now include <img> tags
    );

    // Update status to 'sent'
    const updatedEmail = await Email.findByIdAndUpdate(
      result._id,
      { status: "sent" },
      { new: true, runValidators: true }
    );

    return updatedEmail;
  } catch (error: any) {
    console.error("Error in createEmailIntoDB:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create or send email"
    );
  }
};
const getAllEmailFromDB = async (query: Record<string, unknown>) => {
  const EmailQuery = new QueryBuilder(
    Email.find().populate("issuedBy", "name email"),
    query
  )
    .search(EmailSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await EmailQuery.countTotal();
  const result = await EmailQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleEmailFromDB = async (id: string) => {
  const result = await Email.findById(id);
  return result;
};

const updateEmailIntoDB = async (id: string, payload: Partial<TEmail>) => {
  const email = await Email.findById(id);

  if (!email) {
    throw new AppError(httpStatus.NOT_FOUND, "Email not found");
  }

  // Toggle `isDeleted` status for the selected user only
  // const newStatus = !user.isDeleted;

  // // Check if the user is a company, but only update the selected user
  // if (user.role === "company") {
  //   payload.isDeleted = newStatus;
  // }

  // Update only the selected user
  const result = await Email.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const EmailServices = {
  getAllEmailFromDB,
  getSingleEmailFromDB,
  updateEmailIntoDB,
  createEmailIntoDB,
};
