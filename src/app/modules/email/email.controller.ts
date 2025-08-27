import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { EmailServices } from "./email.service";



const EmailCreate = catchAsync(async (req, res) => {
  const result = await EmailServices.createEmailIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email created successfully",
    data: result,
  });
});

const getAllEmail: RequestHandler = catchAsync(async (req, res) => {
  const result = await EmailServices.getAllEmailFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email retrived succesfully",
    data: result,
  });
});
const getSingleEmail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EmailServices.getSingleEmailFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email is retrieved succesfully",
    data: result,
  });
});

const updateEmail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EmailServices.updateEmailIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email is updated succesfully",
    data: result,
  });
});




export const EmailControllers = {
  getAllEmail,
  getSingleEmail,
  updateEmail,
  EmailCreate
};
