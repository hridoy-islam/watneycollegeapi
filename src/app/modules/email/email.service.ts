import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";

import { EmailSearchableFields } from "./email.constant";
import { TEmail } from "./email.interface";
import Email from "./email.model";
import { sendEmailManual } from "../../utils/sendEmailManual";
import { User } from "../user/user.model";

import moment from "moment";

const createEmailIntoDB = async (payload: TEmail) => {
  try {
    const {
      emailDraft,
      userId,
      issuedBy,
      subject: emailSubject,
      body: emailBody,
    } = payload;

    const foundUser = await User.findById(userId);
    if (!foundUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

   
   
    // Regex for placeholders
    const variableRegex = /\[([^\]]+)\]/g;
    let updatedBody = emailBody;
    let match;

    while ((match = variableRegex.exec(emailBody)) !== null) {
      const key = match[1]; // e.g. "name", "dateOfBirth", "admin"

      let value: string | undefined;

      if (key === "admin") {
        value = "Watney College";
      } else if (key === "adminEmail") {
        value = "info@watneycollege.co.uk";
      } else if (key === "dateOfBirth" && foundUser.dateOfBirth) {
        value = moment(foundUser.dateOfBirth).format("DD MMM, YYYY");
      } else {
        value = (foundUser as any)[key];
      }

      if (value !== undefined) {
        const placeholder = `\\[${key}\\]`;
        const regex = new RegExp(placeholder, "g");
        updatedBody = updatedBody.replace(regex, value);
      } else {
        console.warn(`Placeholder [${key}] not found in user/admin data`);
      }
    }
    const finalBody = updatedBody.replace(/\n/g, "<br/>");
    // create email record in DB
    const result = await Email.create({
      ...payload,
      body: updatedBody,
    });

    // send email manually
    await sendEmailManual(
      foundUser.email,
      "custom_template",
      emailSubject,
      finalBody
    );

    // update status
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
