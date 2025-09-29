import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CourseUnitMaterialServices } from "./courseUnitMaterial.service";

const getAllCourseUnitMaterial: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseUnitMaterialServices.getAllCourseUnitMaterialFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseUnitMaterials retrived succesfully",
    data: result,
  });
});
const getSingleCourseUnitMaterial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseUnitMaterialServices.getSingleCourseUnitMaterialFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseUnitMaterial is retrieved succesfully",
    data: result,
  });
});

const updateCourseUnitMaterial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseUnitMaterialServices.updateCourseUnitMaterialIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseUnitMaterial is updated succesfully",
    data: result,
  });
});

const createCourseUnitMaterial: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseUnitMaterialServices.createCourseUnitMaterialIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "CourseUnitMaterial created successfully",
    data: result,
  });
});

export const CourseUnitMaterialControllers = {
  getAllCourseUnitMaterial,
  getSingleCourseUnitMaterial,
  updateCourseUnitMaterial,
  createCourseUnitMaterial
  
};
