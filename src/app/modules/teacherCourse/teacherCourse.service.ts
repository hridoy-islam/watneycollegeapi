import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";

import { TeacherCourseSearchableFields } from "./teacherCourse.constant";
import { TTeacherCourse } from "./teacherCourse.interface";
import TeacherCourse from "./teacherCourse.model";



const createTeacherCourseIntoDB = async (payload: TTeacherCourse) => {
  try {
    
    const result = await TeacherCourse.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createTeacherCourseIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to create Category");
  }
};

const getAllTeacherCourseFromDB = async (query: Record<string, unknown>) => {
  const TeacherCourseQuery = new QueryBuilder(TeacherCourse.find().populate('courseId'), query)
    .search(TeacherCourseSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await TeacherCourseQuery.countTotal();
  const result = await TeacherCourseQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleTeacherCourseFromDB = async (id: string) => {
  const result = await TeacherCourse.findById(id);
  return result;
};

const updateTeacherCourseIntoDB = async (id: string, payload: Partial<TTeacherCourse>) => {
  const teacherCourse = await TeacherCourse.findById(id);

  if (!teacherCourse) {
    throw new AppError(httpStatus.NOT_FOUND, "TeacherCourse not found");
  }

  
  const result = await TeacherCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};


const deleteTeacherCourseIntoDB = async (id: string) => {
  const teacherCourse = await TeacherCourse.findById(id);

  if (!teacherCourse) {
    throw new AppError(httpStatus.NOT_FOUND, "TeacherCourse not found");
  }

  
  const result = await TeacherCourse.findByIdAndDelete(id, {
    new: true,
    runValidators: true,
  });

  return result;
};






export const TeacherCourseServices = {
  getAllTeacherCourseFromDB,
  getSingleTeacherCourseFromDB,
  updateTeacherCourseIntoDB,
  createTeacherCourseIntoDB,
  deleteTeacherCourseIntoDB
  

};
