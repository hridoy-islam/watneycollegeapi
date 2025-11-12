import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";

import { VerifySearchableFields } from "./verify.constant";
import { TVerify } from "./verify.interface";
import Verify from "./verify.model";

const createVerifyIntoDB = async (payload: TVerify) => {
  try {
    const result = await Verify.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createVerifyIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create Category"
    );
  }
};

const getAllVerifyFromDB = async (query: Record<string, unknown>) => {
  const VerifyQuery = new QueryBuilder(Verify.find(), query)
    .search(VerifySearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await VerifyQuery.countTotal();
  const result = await VerifyQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleVerifyFromDB = async (id: string) => {
  const result = await Verify.findById(id);
  return result;
};

const getStudentVerifyFromWebsite = async (studentId: string, token: any) => {
  if (token !== process.env.STUDENT_TOKEN) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid student");
  }
  const result = await Verify.findOne({ studentId });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found");
  }
  return result;
};

const updateVerifyIntoDB = async (id: string, payload: Partial<TVerify>) => {
  const verify = await Verify.findById(id);

  if (!verify) {
    throw new AppError(httpStatus.NOT_FOUND, "Verify not found");
  }

  // Update only the selected user
  const result = await Verify.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const DeleteSingleVerifyFromDB = async (id: string) => {
  const verify = await Verify.findById(id);

  if (!verify) {
    throw new AppError(httpStatus.NOT_FOUND, "Verify not found");
  }

  const result = await Verify.findByIdAndDelete(id);
  return result;
};

export const VerifyServices = {
  getAllVerifyFromDB,
  getSingleVerifyFromDB,
  updateVerifyIntoDB,
  createVerifyIntoDB,
  DeleteSingleVerifyFromDB,
  getStudentVerifyFromWebsite
};
