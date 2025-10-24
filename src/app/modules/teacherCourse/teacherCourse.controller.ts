import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TeacherCourseServices } from "./teacherCourse.service";



const TeacherCourseCreate = catchAsync(async (req, res) => {
  const result = await TeacherCourseServices.createTeacherCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TeacherCourse created successfully",
    data: result,
  });
});

const getAllTeacherCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await TeacherCourseServices.getAllTeacherCourseFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TeacherCourse retrived succesfully",
    data: result,
  });
});
const getSingleTeacherCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeacherCourseServices.getSingleTeacherCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TeacherCourse is retrieved succesfully",
    data: result,
  });
});

const updateTeacherCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeacherCourseServices.updateTeacherCourseIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TeacherCourse is updated succesfully",
    data: result,
  });
});

const deleteTeacherCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeacherCourseServices.deleteTeacherCourseIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "TeacherCourse is deleted succesfully",
    data: result,
  });
});




export const TeacherCourseControllers = {
  getAllTeacherCourse,
  getSingleTeacherCourse,
  updateTeacherCourse,
  TeacherCourseCreate,
  deleteTeacherCourse
};
