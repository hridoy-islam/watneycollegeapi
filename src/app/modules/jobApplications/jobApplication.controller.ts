import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { JobApplicationServices } from "./jobApplication.service";

const getAllJobApplication: RequestHandler = catchAsync(async (req, res) => {
  const result = await JobApplicationServices.getAllJobApplicationFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Applications retrived succesfully",
    data: result,
  });
});
const getSingleJobApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await JobApplicationServices.getSingleJobApplicationFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application is retrieved succesfully",
    data: result,
  });
});

const updateJobApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await JobApplicationServices.updateJobApplicationIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application is updated succesfully",
    data: result,
  });
});

const createJobApplication: RequestHandler = catchAsync(async (req, res) => {
  const result = await JobApplicationServices.createJobApplicationIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Application created successfully",
    data: result,
  });
});

export const JobApplicationControllers = {
  getAllJobApplication,
  getSingleJobApplication,
  updateJobApplication,
  createJobApplication
  
};
