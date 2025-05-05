import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ApplicationServices } from "./application.service";

const getAllApplication: RequestHandler = catchAsync(async (req, res) => {
  const result = await ApplicationServices.getAllApplicationFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Applications retrived succesfully",
    data: result,
  });
});
const getSingleApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ApplicationServices.getSingleApplicationFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application is retrieved succesfully",
    data: result,
  });
});

const updateApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ApplicationServices.updateApplicationIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application is updated succesfully",
    data: result,
  });
});

const createApplication: RequestHandler = catchAsync(async (req, res) => {
  const result = await ApplicationServices.createApplicationIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Application created successfully",
    data: result,
  });
});

export const ApplicationControllers = {
  getAllApplication,
  getSingleApplication,
  updateApplication,
  createApplication
  
};
