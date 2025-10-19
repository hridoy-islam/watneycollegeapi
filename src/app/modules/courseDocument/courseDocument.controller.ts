import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CourseDocumentServices } from "./courseDocument.service";



const CourseDocumentCreate = catchAsync(async (req, res) => {
  const result = await CourseDocumentServices.createCourseDocumentIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseDocument created successfully",
    data: result,
  });
});

const getAllCourseDocument: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseDocumentServices.getAllCourseDocumentFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseDocument retrived succesfully",
    data: result,
  });
});
const getSingleCourseDocument = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseDocumentServices.getSingleCourseDocumentFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseDocument is retrieved succesfully",
    data: result,
  });
});

const updateCourseDocument = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseDocumentServices.updateCourseDocumentIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseDocument is updated succesfully",
    data: result,
  });
});


const deleteCourseDocument = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseDocumentServices.deleteCourseDocumentIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CourseDocument is deleted succesfully",
    data: result,
  });
});




export const CourseDocumentControllers = {
  getAllCourseDocument,
  getSingleCourseDocument,
  updateCourseDocument,
  CourseDocumentCreate,
  deleteCourseDocument
};
