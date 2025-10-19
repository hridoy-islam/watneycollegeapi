import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";

import { courseDocumentSearchableFields } from "./courseDocument.constant";
import { TCourseDocument } from "./courseDocument.interface";
import CourseDocument from "./courseDocument.model";



const createCourseDocumentIntoDB = async (payload: TCourseDocument) => {
  try {
    
    const result = await CourseDocument.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createCourseDocumentIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create Category");
  }
};

const getAllCourseDocumentFromDB = async (query: Record<string, unknown>) => {
  const CourseDocumentQuery = new QueryBuilder(CourseDocument.find().populate("courseId"), query)
    .search(courseDocumentSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await CourseDocumentQuery.countTotal();
  const result = await CourseDocumentQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleCourseDocumentFromDB = async (id: string) => {
  const result = await CourseDocument.findById(id);
  return result;
};

const updateCourseDocumentIntoDB = async (id: string, payload: Partial<TCourseDocument>) => {
  const courseDocument = await CourseDocument.findById(id);

  if (!courseDocument) {
    throw new AppError(httpStatus.NOT_FOUND, "CourseDocument not found");
  }

  const result = await CourseDocument.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteCourseDocumentIntoDB = async (id: string) => {
  const courseDocument = await CourseDocument.findById(id);

  if (!courseDocument) {
    throw new AppError(httpStatus.NOT_FOUND, "CourseDocument not found");
  }

  const result = await CourseDocument.findByIdAndDelete(id, {
    new: true,
    runValidators: true,
  });

  return result;
};








export const CourseDocumentServices = {
  getAllCourseDocumentFromDB,
  getSingleCourseDocumentFromDB,
  updateCourseDocumentIntoDB,
  createCourseDocumentIntoDB,
  deleteCourseDocumentIntoDB
  

};
