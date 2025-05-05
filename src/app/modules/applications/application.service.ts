import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { ApplicationSearchableFields } from "./application.constant";
import { TApplication } from "./application.interface";
import { Application } from "./application.model";
import AppError from "../../errors/AppError";

const getAllApplicationFromDB = async (query: Record<string, unknown>) => {
  const ApplicationQuery = new QueryBuilder(Application.find(), query)
    .search(ApplicationSearchableFields)
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

const getSingleApplicationFromDB = async (id: string) => {
  const result = await Application.findById(id);
  return result;
};

const updateApplicationIntoDB = async (id: string, payload: Partial<TApplication>) => {
  const application = await Application.findById(id);
  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Application not found");
  }

  const result = await Application.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};


const createApplicationIntoDB = async (payload: Partial<TApplication>) => {
  const result = await Application.create(payload);
  return result;
};




export const ApplicationServices = {
  getAllApplicationFromDB,
  getSingleApplicationFromDB,
  updateApplicationIntoDB,
  createApplicationIntoDB
  
};
