import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { SignatureServices } from "./signature.service";



const SignatureCreate = catchAsync(async (req, res) => {
  const result = await SignatureServices.createSignatureIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Signature created successfully",
    data: result,
  });
});

const getAllSignature: RequestHandler = catchAsync(async (req, res) => {
  const result = await SignatureServices.getAllSignatureFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Signature retrived succesfully",
    data: result,
  });
});
const getSingleSignature = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SignatureServices.getSingleSignatureFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Signature is retrieved succesfully",
    data: result,
  });
});

const updateSignature = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SignatureServices.updateSignatureIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Signature is updated succesfully",
    data: result,
  });
});




export const SignatureControllers = {
  getAllSignature,
  getSingleSignature,
  updateSignature,
  SignatureCreate
};
