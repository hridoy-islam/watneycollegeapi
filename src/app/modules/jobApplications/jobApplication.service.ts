import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { JobApplicationSearchableFields } from "./jobApplication.constant";
import { TJobApplication } from "./jobApplication.interface";
import { JobApplication } from "./jobApplication.model";
import AppError from "../../errors/AppError";
import { application } from "express";
import mongoose from "mongoose";
import { sendEmail } from "../../utils/sendEmail";




const getAllJobApplicationFromDB = async (query: Record<string, unknown>) => {
  const { searchTerm, ...otherQueryParams } = query;

  const processedQuery: Record<string, any> = { ...otherQueryParams };

  
  // 🔍 Handle global search using searchTerm
  if (searchTerm && typeof searchTerm === 'string') {
    const searchRegex = new RegExp(searchTerm.trim(), 'i');

    JobApplicationSearchableFields.forEach((field) => {
      processedQuery[`$expr`] = processedQuery[`$expr`] || {};
      processedQuery[`$expr`][`$regexMatch`] = processedQuery[`$expr`][`$regexMatch`] || {};
      
      // Push each field into an OR-like structure using $or array
      processedQuery[`$expr`][`$regexMatch`]["input"] = `$${field}`;
      processedQuery[`$expr`][`$regexMatch`]["regex"] = searchRegex;
    });
  }


  const ApplicationQuery = new QueryBuilder(
    JobApplication.find()
      .populate("jobId")
      .populate({
        path: "applicantId",
        select: "title firstName initial lastName email phone",
      }),
    processedQuery
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await ApplicationQuery.countTotal();
  const result = await ApplicationQuery.modelQuery;

  return {
    meta,
    result,
  };
};



const getSingleJobApplicationFromDB = async (id: string) => {
  const result = await JobApplication.findById(id).populate("jobId");
  return result;
};

const updateJobApplicationIntoDB = async (
  id: string,
  payload: Partial<TJobApplication>
) => {
  const application = await JobApplication.findById(id);
  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Application not found");
  }

  const result = await JobApplication.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const createJobApplicationIntoDB = async (
  payload: Partial<TJobApplication>
) => {
  const result = await JobApplication.create(payload);

  const populatedResult = await JobApplication.findById(result._id)
    .populate<{ jobTitle: string }>("jobId", "jobTitle") 
    .populate<{ name: string; email: string }>("applicantId", "name email"); 

  if (!populatedResult) {
    throw new Error("Failed to populate job application");
  }

  const title = populatedResult.jobId.jobTitle;
  const applicantName = populatedResult.applicantId.name;
  const applicantEmail = populatedResult.applicantId.email;

  const emailSubject = `New Application for ${title}`;
const otp= ''
  await sendEmail(
    applicantEmail,
    "job-application",
    emailSubject,
    applicantName,
    otp,
    title
  );

  return result;
};

export const JobApplicationServices = {
  getAllJobApplicationFromDB,
  getSingleJobApplicationFromDB,
  updateJobApplicationIntoDB,
  createJobApplicationIntoDB,
};
