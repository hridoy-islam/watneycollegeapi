import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CourseUnitServices } from "./courseUnit.service";

const getAllCourseUnit: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseUnitServices.getAllCourseUnitFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseUnits retrived succesfully",
    data: result,
  });
});
const getSingleCourseUnit = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseUnitServices.getSingleCourseUnitFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseUnit is retrieved succesfully",
    data: result,
  });
});

const updateCourseUnit = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseUnitServices.updateCourseUnitIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseUnit is updated succesfully",
    data: result,
  });
});
const deleteCourseUnit = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseUnitServices.deleteCourseUnitIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseUnit is deleted succesfully",
    data: result,
  });
});

const createCourseUnit: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseUnitServices.createCourseUnitIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "CourseUnit created successfully",
    data: result,
  });
});

export const CourseUnitControllers = {
  getAllCourseUnit,
  getSingleCourseUnit,
  updateCourseUnit,
  createCourseUnit,
  deleteCourseUnit
  
};
