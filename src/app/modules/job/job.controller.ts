import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { JobServices } from "./job.service";

const getAllJob: RequestHandler = catchAsync(async (req, res) => {
  const result = await JobServices.getAllJobFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Jobs retrived succesfully",
    data: result,
  });
});
const getSingleJob = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await JobServices.getSingleJobFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job is retrieved succesfully",
    data: result,
  });
});

const updateJob = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await JobServices.updateJobIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job is updated succesfully",
    data: result,
  });
});

const createJob: RequestHandler = catchAsync(async (req, res) => {
  const result = await JobServices.createJobIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

export const JobControllers = {
  getAllJob,
  getSingleJob,
  updateJob,
  createJob
  
};
