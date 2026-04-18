import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";

import { VerifySearchableFields } from "./verify.constant";
import { TVerify } from "./verify.interface";
import Verify from "./verify.model";
import { ApplicationCourse } from "../applicationCourse/applicationCourse.model";
import { User } from "../user/user.model";

const createVerifyIntoDB = async (payload: TVerify) => {
  try {
    const result = await Verify.create(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createVerifyIntoDB:", error);

    // Throw the original error or wrap it with additional context
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create Category"
    );
  }
};

const getAllVerifyFromDB = async (query: Record<string, unknown>) => {
  const VerifyQuery = new QueryBuilder(Verify.find().populate({
      path: "applicationId",
      select: "studentId",
      populate: [
        {
          path: "studentId",
          select:
            "title firstName initial lastName email phone studentType isCompleted dateOfBirth",
        },
        {
          path: "courseId",
          select: "name code", // adjust based on your schema
        },
        {
          path: "intakeId",
          select: "termName startDate", // adjust if needed
        },
      ],
    }), query)
    .search(VerifySearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await VerifyQuery.countTotal();
  const result = await VerifyQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleVerifyFromDB = async (id: string) => {
  const result = await Verify.findById(id);
  return result;
};

const getStudentVerifyFromWebsite = async (lastName: string, dob: string, token: any) => {
  // 1. Check the token
  if (token !== process.env.STUDENT_TOKEN) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid student token");
  }

  // 2. Parse the dob into UTC date range
  let year: number, month: number, day: number;

  if (typeof dob === 'string' && dob.includes("/")) {
    const parts = dob.split("/");
    day   = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year  = parseInt(parts[2], 10);
  } else if (typeof dob === 'string' && dob.includes("-")) {
    const parts = dob.split("-");
    year  = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day   = parseInt(parts[2], 10);
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid date format");
  }

  const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  const endOfDay   = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

  // 3. Find User by lastName and dateOfBirth
  const user = await User.findOne({
    lastName: { $regex: new RegExp(`^${lastName}$`, "i") },
    dateOfBirth: { $gte: startOfDay, $lte: endOfDay },
  });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "Student not found");

  // 4. (Optional) Confirm ApplicationCourse exists
  const applicationCourse = await ApplicationCourse.findOne({ studentId: user._id });
  if (!applicationCourse) throw new AppError(httpStatus.NOT_FOUND, "Application course not found");

  // 5. ✅ Find Verify by studentId — applicationId in Verify doesn't match ApplicationCourse._id
  const verifyRecord = await Verify.findOne({ studentId: user._id });
  if (!verifyRecord) throw new AppError(httpStatus.NOT_FOUND, "Verification record not found");

  return verifyRecord;
};


const updateVerifyIntoDB = async (id: string, payload: Partial<TVerify>) => {
  const verify = await Verify.findById(id);

  if (!verify) {
    throw new AppError(httpStatus.NOT_FOUND, "Verify not found");
  }

  // Update only the selected user
  const result = await Verify.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const DeleteSingleVerifyFromDB = async (id: string) => {
  const verify = await Verify.findById(id);

  if (!verify) {
    throw new AppError(httpStatus.NOT_FOUND, "Verify not found");
  }

  const result = await Verify.findByIdAndDelete(id);
  return result;
};

export const VerifyServices = {
  getAllVerifyFromDB,
  getSingleVerifyFromDB,
  updateVerifyIntoDB,
  createVerifyIntoDB,
  DeleteSingleVerifyFromDB,
  getStudentVerifyFromWebsite
};
