import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ApplicationCourseServices } from "./applicationCourse.service";

const getAllApplicationCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await ApplicationCourseServices.getAllApplicationCourseFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ApplicationCourses retrived succesfully",
    data: result,
  });
});
const getSingleApplicationCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ApplicationCourseServices.getSingleApplicationCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ApplicationCourse is retrieved succesfully",
    data: result,
  });
});

const updateApplicationCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ApplicationCourseServices.updateApplicationCourseIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ApplicationCourse is updated succesfully",
    data: result,
  });
});

const createApplicationCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await ApplicationCourseServices.createApplicationCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "ApplicationCourse created successfully",
    data: result,
  });
});

export const ApplicationCourseControllers = {
  getAllApplicationCourse,
  getSingleApplicationCourse,
  updateApplicationCourse,
  createApplicationCourse
  
};
