import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { ApplicationCourse } from "./applicationCourse.model";
import { TApplicationCourse } from "./applicationCourse.interface";
import { ApplicationCourseSearchableFields } from "./applicationCourse.constant";

const getAllApplicationCourseFromDB = async (query: Record<string, unknown>) => {
  const ApplicationCourseQuery = new QueryBuilder(ApplicationCourse.find().populate({
      path: "studentId",
      select: "title firstName initial lastName email phone",
    }).populate('intakeId').populate('courseId'), query)
    .search(ApplicationCourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await ApplicationCourseQuery.countTotal();
  const result = await ApplicationCourseQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleApplicationCourseFromDB = async (id: string) => {
  const result = await ApplicationCourse.findById(id);
  return result;
};

const updateApplicationCourseIntoDB = async (id: string, payload: Partial<TApplicationCourse>) => {
  const applicationCourse = await ApplicationCourse.findById(id);
  if (!applicationCourse) {
    throw new AppError(httpStatus.NOT_FOUND, "ApplicationCourse not found");
  }

  const result = await ApplicationCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};


const createApplicationCourseIntoDB = async (payload: Partial<TApplicationCourse>) => {
  const result = await ApplicationCourse.create(payload);
  return result;
};




export const ApplicationCourseServices = {
  getAllApplicationCourseFromDB,
  getSingleApplicationCourseFromDB,
  updateApplicationCourseIntoDB,
  createApplicationCourseIntoDB
  
};
