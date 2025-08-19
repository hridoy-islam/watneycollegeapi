import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Job } from "./job.model";
import { TJob } from "./job.interface";
import { JobSearchableFields } from "./job.constant";

const getAllJobFromDB = async (query: Record<string, unknown>) => {
  const JobQuery = new QueryBuilder(Job.find(), query)
    .search(JobSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await JobQuery.countTotal();
  const result = await JobQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleJobFromDB = async (id: string) => {
  const result = await Job.findById(id);
  return result;
};

const updateJobIntoDB = async (id: string, payload: Partial<TJob>) => {
  const job = await Job.findById(id);
  if (!job) {
    throw new AppError(httpStatus.NOT_FOUND, "Job not found");
  }

  const result = await Job.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};


const createJobIntoDB = async (payload: Partial<TJob>) => {
  const result = await Job.create(payload);
  return result;
};




export const JobServices = {
  getAllJobFromDB,
  getSingleJobFromDB,
  updateJobIntoDB,
  createJobIntoDB
  
};
