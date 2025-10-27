import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";

import { LogsSearchableFields } from "./logs.constant";
import { TLogs } from "./logs.interface";
import Logs from "./logs.model";
import { User } from "../user/user.model";

import moment from "moment";

const getAllLogsFromDB = async (query: Record<string, unknown>, currentUser?: any) => {
  const { fromDate, toDate, userId, ...restQuery } = query;

  let finalQuery: any = { ...restQuery };

  // Default: If no date range provided, show current month
  const now = moment();
  if (!fromDate && !toDate) {
    finalQuery.createdAt = {
      $gte: now.startOf('month').toDate(),
      $lte: now.endOf('month').toDate(),
    };
  } else if (fromDate || toDate) {
    const dateFilter: any = {};
    if (fromDate) dateFilter.$gte = moment(fromDate as string).startOf('day').toDate();
    if (toDate) dateFilter.$lte = moment(toDate as string).endOf('day').toDate();
    finalQuery.createdAt = dateFilter;
  }

  // Handle multiple userIds (comma-separated)
  if (userId) {
    const userIds = (userId as string).split(',').map(id => id.trim());
    finalQuery.userId = { $in: userIds };
  } else if (currentUser?.role === 'teacher') {
    // If current user is a teacher, show only their logs by default
    finalQuery.userId = currentUser._id;
  }

  const LogsQuery = new QueryBuilder(Logs.find().populate("userId","name"), finalQuery)
    .search(LogsSearchableFields)
    .filter(finalQuery)
    .sort()
    .paginate()
    .fields();

  const meta = await LogsQuery.countTotal();
  const result = await LogsQuery.modelQuery;

  return {
    meta,
    result,
  };
};


const getSingleLogsFromDB = async (id: string) => {
  const result = await Logs.findById(id);
  return result;
};

const updateLogsIntoDB = async (payload: Partial<TLogs>) => {
  const { userId, action, logoutAt } = payload;

  if (!userId || action !== "logout") {
    return null;
  }

  // Find the latest login log for this user
  const latestLoginLog = await Logs.findOne({ userId, action: "login" }).sort({
    createdAt: -1,
  });

  if (!latestLoginLog) {
    return null;
  }

  // Update that log entry
  const result = await Logs.findByIdAndUpdate(
    latestLoginLog._id,
    {
      action: "logout",
      logoutAt,
      // description: "User logged out successfully",
    },
    { new: true, runValidators: true }
  );

  return result;
};



const updateLogsByIdIntoDB = async (id: string, payload: Partial<TLogs>) => {
  const logs = await Logs.findById(id);
  if (!Logs) {
    throw new AppError(httpStatus.NOT_FOUND, "Logs not found");
  }

  const result = await Logs.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const createLogsIntoDB = async (payload: Partial<TLogs>) => {
  const result = await Logs.create(payload);
  return result;
};

export const LogsServices = {
  getAllLogsFromDB,
  getSingleLogsFromDB,
  updateLogsIntoDB,
  createLogsIntoDB,
  updateLogsByIdIntoDB
};
