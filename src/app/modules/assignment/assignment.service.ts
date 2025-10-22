import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Assignment } from "./assignment.model";
import { TAssignment } from "./assignment.interface";
import { AssignmentSearchableFields } from "./assignment.constant";

const getAllAssignmentFromDB = async (query: Record<string, unknown>) => {
  const AssignmentQuery = new QueryBuilder(
     Assignment.find().populate([
      {
        path: "studentId",
        select: "firstName title initial lastName name email",
      },
      {
        path: "submissions.submitBy",
        select: "firstName lastName name email role", // populate student details
      },
      {
        path: "feedbacks.submitBy",
        select: "firstName lastName name email role", // populate teacher/admin details
      },
      {
        path: "applicationId",
        populate: {
          path: "courseId",
          select: "name", // get only course name
        },
      },
      {
        path: "unitId",
        select: "title", // get only unit title
      },
      {
        path: "unitMaterialId",
        select: "assignments", // populate only assignments from unit material
      },
    ]),
    query
  )
    .search(AssignmentSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await AssignmentQuery.countTotal();
  const result = await AssignmentQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleAssignmentFromDB = async (id: string) => {
  const result = await Assignment.findById(id);
  return result;
};

const updateAssignmentIntoDB = async (
  id: string,
  payload: Partial<TAssignment>
) => {
  const assignment = await Assignment.findById(id);
  if (!assignment) {
    throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  const result = await Assignment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const createAssignmentIntoDB = async (payload: Partial<TAssignment>) => {
  const result = await Assignment.create(payload);
  return result;
};

export const AssignmentServices = {
  getAllAssignmentFromDB,
  getSingleAssignmentFromDB,
  updateAssignmentIntoDB,
  createAssignmentIntoDB,
};
