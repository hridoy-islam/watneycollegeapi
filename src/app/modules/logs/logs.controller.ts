import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { LogsServices } from "./logs.service";



const LogsCreate = catchAsync(async (req, res) => {
  const result = await LogsServices.createLogsIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logs created successfully",
    data: result,
  });
});

const getAllLogs: RequestHandler = catchAsync(async (req, res) => {
  const result = await LogsServices.getAllLogsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logs retrived succesfully",
    data: result,
  });
});
const getSingleLogs = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LogsServices.getSingleLogsFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logs is retrieved succesfully",
    data: result,
  });
});

const updateLogs = catchAsync(async (req, res) => {
  const result = await LogsServices.updateLogsIntoDB( req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logs is updated succesfully",
    data: result,
  });
});



const updateLogsById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LogsServices.updateLogsByIdIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logs is updated succesfully",
    data: result,
  });
});



export const LogsControllers = {
  getAllLogs,
  getSingleLogs,
  updateLogs,
  LogsCreate,
  updateLogsById
};
