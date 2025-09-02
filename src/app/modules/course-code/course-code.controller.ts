import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { courseCodeServices } from "./course-code.service";



const courseCodeCreate = catchAsync(async (req, res) => {
  const result = await courseCodeServices.createcourseCodeIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "courseCode created successfully",
    data: result,
  });
});

const getAllcourseCode: RequestHandler = catchAsync(async (req, res) => {
  const result = await courseCodeServices.getAllcourseCodeFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "courseCode retrived succesfully",
    data: result,
  });
});
const getSinglecourseCode = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseCodeServices.getSinglecourseCodeFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "courseCode is retrieved succesfully",
    data: result,
  });
});

const updatecourseCode = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseCodeServices.updatecourseCodeIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "courseCode is updated succesfully",
    data: result,
  });
});




export const courseCodeControllers = {
  getAllcourseCode,
  getSinglecourseCode,
  updatecourseCode,
  courseCodeCreate
};
