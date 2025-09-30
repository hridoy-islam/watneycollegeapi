import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { CourseUnit } from "./courseUnit.model";
import { TCourseUnit } from "./courseUnit.interface";
import { CourseUnitSearchableFields } from "./courseUnit.constant";
import { CourseUnitMaterial } from "../courseUnitMaterial/courseUnitMaterial.model";

const getAllCourseUnitFromDB = async (query: Record<string, unknown>) => {
  const CourseUnitQuery = new QueryBuilder(
    CourseUnit.find().populate({
      path: "courseId",
      select: "name",
    }),
    query
  )
    .search(CourseUnitSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await CourseUnitQuery.countTotal();
  const result = await CourseUnitQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleCourseUnitFromDB = async (id: string) => {
  const result = await CourseUnit.findById(id).populate({
    path: "courseId",
    select: "name",
  });
  return result;
};

const updateCourseUnitIntoDB = async (
  id: string,
  payload: Partial<TCourseUnit>
) => {
  const courseUnit = await CourseUnit.findById(id);
  if (!courseUnit) {
    throw new AppError(httpStatus.NOT_FOUND, "CourseUnit not found");
  }

  const result = await CourseUnit.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const createCourseUnitIntoDB = async (payload: Partial<TCourseUnit>) => {
  const result = await CourseUnit.create(payload);
  return result;
};

const deleteCourseUnitIntoDB = async (id: string) => {
  const courseUnit = await CourseUnit.findById(id);
  if (!courseUnit) {
    throw new AppError(httpStatus.NOT_FOUND, "CourseUnit not found");
  }

  await CourseUnitMaterial.deleteMany({ unitId: id });

  // Delete the course unit itself
  const result = await CourseUnit.findByIdAndDelete(id);
  return result;
};


export const CourseUnitServices = {
  getAllCourseUnitFromDB,
  getSingleCourseUnitFromDB,
  updateCourseUnitIntoDB,
  createCourseUnitIntoDB,
  deleteCourseUnitIntoDB
};
