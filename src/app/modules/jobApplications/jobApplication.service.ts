import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { JobApplicationSearchableFields } from "./jobApplication.constant";
import { TJobApplication } from "./jobApplication.interface";
import { JobApplication } from "./jobApplication.model";
import AppError from "../../errors/AppError";
import { application } from "express";

const getAllJobApplicationFromDB = async (query: Record<string, unknown>) => {
  const ApplicationQuery = new QueryBuilder(
    JobApplication.find().populate("jobId").populate({
      path: "applicantId",
      select: "title firstName initial lastName email phone",
    }),
    query
  )
    .search(JobApplicationSearchableFields)
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
  return result;
};

export const JobApplicationServices = {
  getAllJobApplicationFromDB,
  getSingleJobApplicationFromDB,
  updateJobApplicationIntoDB,
  createJobApplicationIntoDB,
};
