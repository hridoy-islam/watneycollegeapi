import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { CourseUnitMaterial } from "./courseUnitMaterial.model";
import { TCourseUnitMaterial } from "./courseUnitMaterial.interface";
import { CourseUnitMaterialSearchableFields } from "./courseUnitMaterial.constant";

const getAllCourseUnitMaterialFromDB = async (query: Record<string, unknown>) => {
  const CourseUnitMaterialQuery = new QueryBuilder(CourseUnitMaterial.find(), query)
    .search(CourseUnitMaterialSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await CourseUnitMaterialQuery.countTotal();
  const result = await CourseUnitMaterialQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleCourseUnitMaterialFromDB = async (id: string) => {
  const result = await CourseUnitMaterial.findById(id);
  return result;
};

const updateCourseUnitMaterialIntoDB = async (id: string, payload: Partial<TCourseUnitMaterial>) => {
  const courseUnitMaterial = await CourseUnitMaterial.findById(id);
  if (!courseUnitMaterial) {
    throw new AppError(httpStatus.NOT_FOUND, "CourseUnitMaterial not found");
  }

  const result = await CourseUnitMaterial.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};


const createCourseUnitMaterialIntoDB = async (payload: Partial<TCourseUnitMaterial>) => {
  const result = await CourseUnitMaterial.create(payload);
  return result;
};




export const CourseUnitMaterialServices = {
  getAllCourseUnitMaterialFromDB,
  getSingleCourseUnitMaterialFromDB,
  updateCourseUnitMaterialIntoDB,
  createCourseUnitMaterialIntoDB
  
};
