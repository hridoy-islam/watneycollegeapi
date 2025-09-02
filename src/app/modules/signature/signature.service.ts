import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";

import { SignatureSearchableFields } from "./signature.constant";
import { TSignature } from "./signature.interface";
import Signature from "./signature.model";



const createSignatureIntoDB = async (payload: TSignature) => {
  try {
    
    const result = await Signature.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createSignatureIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create Category");
  }
};

const getAllSignatureFromDB = async (query: Record<string, unknown>) => {
  const SignatureQuery = new QueryBuilder(Signature.find(), query)
    .search(SignatureSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await SignatureQuery.countTotal();
  const result = await SignatureQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleSignatureFromDB = async (id: string) => {
  const result = await Signature.findById(id);
  return result;
};

const updateSignatureIntoDB = async (id: string, payload: Partial<TSignature>) => {
  const signature = await Signature.findById(id);

  if (!signature) {
    throw new AppError(httpStatus.NOT_FOUND, "Signature not found");
  }

  // Toggle `isDeleted` status for the selected user only
  // const newStatus = !user.isDeleted;

  // // Check if the user is a company, but only update the selected user
  // if (user.role === "company") {
  //   payload.isDeleted = newStatus;
  // }

  // Update only the selected user
  const result = await Signature.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};






export const SignatureServices = {
  getAllSignatureFromDB,
  getSingleSignatureFromDB,
  updateSignatureIntoDB,
  createSignatureIntoDB
  

};
