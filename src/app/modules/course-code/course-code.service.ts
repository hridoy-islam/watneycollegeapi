import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";

import { courseCodeSearchableFields } from "./course-code.constant";
import { TcourseCode } from "./course-code.interface";
import CourseCode from "./course-code.model";



const createcourseCodeIntoDB = async (payload: TcourseCode) => {
  try {
    
    const result = await CourseCode.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createcourseCodeIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create Category");
  }
};

const getAllcourseCodeFromDB = async (query: Record<string, unknown>) => {
  const courseCodeQuery = new QueryBuilder(CourseCode.find().populate('course'), query)
    .search(courseCodeSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await courseCodeQuery.countTotal();
  const result = await courseCodeQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSinglecourseCodeFromDB = async (id: string) => {
  const result = await CourseCode.findById(id);
  return result;
};

const updatecourseCodeIntoDB = async (id: string, payload: Partial<TcourseCode>) => {
  const courseCode = await CourseCode.findById(id);

  if (!courseCode) {
    throw new AppError(httpStatus.NOT_FOUND, "courseCode not found");
  }

  // Toggle `isDeleted` status for the selected user only
  // const newStatus = !user.isDeleted;

  // // Check if the user is a company, but only update the selected user
  // if (user.role === "company") {
  //   payload.isDeleted = newStatus;
  // }

  // Update only the selected user
  const result = await CourseCode.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};






export const courseCodeServices = {
  getAllcourseCodeFromDB,
  getSinglecourseCodeFromDB,
  updatecourseCodeIntoDB,
  createcourseCodeIntoDB
  

};
