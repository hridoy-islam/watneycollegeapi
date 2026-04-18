import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { VerifyServices } from "./verify.service";
import AppError from "../../errors/AppError";



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
  // FIX: Extract from req.query instead of req.params
  const { lastName, dob } = req.query; 
  const token = req.headers['x-student-token'];

  // Add a safety check to ensure the fields actually exist
  if (!lastName || !dob) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing lastName or dob in query parameters");
  }

  // Pass them as strings to the service
  const result = await VerifyServices.getStudentVerifyFromWebsite(
    lastName as string, 
    dob as string, 
    token
  );

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
