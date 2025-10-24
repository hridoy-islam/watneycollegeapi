import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Assignment } from "./assignment.model";
import { TAssignment } from "./assignment.interface";
import { AssignmentSearchableFields } from "./assignment.constant";
import TeacherCourse from "../teacherCourse/teacherCourse.model";

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


const getTeacherAssignmentFeedbackFromDB = async (
  teacherId: string,
  query: Record<string, unknown>
) => {
  // 1️⃣ Get all course IDs assigned to the teacher
  const teacherCourses = await TeacherCourse.find({ teacherId }).select("courseId");
  
  if (!teacherCourses || teacherCourses.length === 0) {
    return {
      meta: { page: 1, limit: 10, total: 0, totalPage: 0 },
      result: [],
    };
  }

  const courseIds = teacherCourses.map(tc => tc.courseId);

  // 2️⃣ Build the query for submitted assignments
  const AssignmentQuery = new QueryBuilder(
    Assignment.find({ status: "submitted" }).populate([
      { path: "studentId", select: "firstName title initial lastName name email" },
      { path: "submissions.submitBy", select: "firstName lastName name email role" },
      { path: "feedbacks.submitBy", select: "firstName lastName name email role" },
      { 
        path: "applicationId",
        populate: { path: "courseId", select: "name" },
        match: { courseId: { $in: courseIds } },
      },
      { path: "unitId", select: "title" },
      { path: "unitMaterialId", select: "assignments" },
    ]),
    query
  )
    .search(AssignmentSearchableFields)
    .filter(query)
    .sort()
    .fields()
    .paginate();

  // 3️⃣ Get all results
  const result = await AssignmentQuery.modelQuery;

  // 4️⃣ Filter out assignments where applicationId is null
  const filteredResult = result.filter(a => a.applicationId !== null);

  // 5️⃣ Handle limit and pagination properly
  const total = filteredResult.length;
  const page = Number(query.page) || 1;
  const limitParam = query.limit === 'all' ? total : Number(query.limit) || 10;

  // Slice results if limit is not 'all'
  const paginatedResult = query.limit === 'all' ? filteredResult : filteredResult.slice((page - 1) * limitParam, page * limitParam);

  const totalPage = limitParam > 0 ? Math.ceil(total / limitParam) : 1;

  const meta = { page, limit: limitParam, total, totalPage };

  return { meta, result: paginatedResult };
};



export const AssignmentServices = {
  getAllAssignmentFromDB,
  getSingleAssignmentFromDB,
  updateAssignmentIntoDB,
  createAssignmentIntoDB,
  getTeacherAssignmentFeedbackFromDB,
};
