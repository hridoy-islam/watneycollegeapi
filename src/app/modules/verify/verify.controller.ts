import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { VerifyServices } from "./verify.service";



const VerifyCreate = catchAsync(async (req, res) => {
  const result = await VerifyServices.createVerifyIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verify created successfully",
    data: result,
  });
});

const getAllVerify: RequestHandler = catchAsync(async (req, res) => {
  const result = await VerifyServices.getAllVerifyFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verify retrived succesfully",
    data: result,
  });
});
const getSingleVerify = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await VerifyServices.getSingleVerifyFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verify is retrieved succesfully",
    data: result,
  });
});

const getStudentVerify = catchAsync(async (req, res) => {
  const { studentId } = req.params;
    const token = req.headers['x-student-token'];

  const result = await VerifyServices.getStudentVerifyFromWebsite(studentId,token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verify is retrieved succesfully",
    data: result,
  });
});


const updateVerify = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await VerifyServices.updateVerifyIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verify is updated succesfully",
    data: result,
  });
});

const deleteVerify = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await VerifyServices.DeleteSingleVerifyFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verify is deleted succesfully",
    data: result,
  });
});





export const VerifyControllers = {
  getAllVerify,
  getSingleVerify,
  updateVerify,
  VerifyCreate,
  deleteVerify,
  getStudentVerify
};
