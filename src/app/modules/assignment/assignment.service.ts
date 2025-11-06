import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Assignment } from "./assignment.model";
import { TAssignment } from "./assignment.interface";
import { AssignmentSearchableFields } from "./assignment.constant";
import TeacherCourse from "../teacherCourse/teacherCourse.model";
import { ApplicationCourse } from "../applicationCourse/applicationCourse.model";
import { application } from "express";

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
        path: "observationFeedback.submitBy",
        select: "firstName lastName name email role", // populate teacher/admin details
      },
       {
        path: "finalFeedback.submitBy",
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
  const teacherCourses = await TeacherCourse.find({ teacherId }).select("courseId");

  if (!teacherCourses || teacherCourses.length === 0) {
    return {
      meta: { page: 1, limit: 10, total: 0, totalPage: 0 },
      result: [],
    };
  }

const courseIds = (teacherCourses as any[]).map(tc => tc.courseId);

  // Extract filters from query
  const courseIdFilter = query.courseId ? String(query.courseId) : null;
  const termIdFilter = query.termId ? String(query.termId) : null;

  // 2️⃣ Build the query for submitted assignments
  const AssignmentQuery = new QueryBuilder(
    Assignment.find({ status: "submitted" }).populate([
      { path: "studentId", select: "firstName title initial lastName name email" },
      { path: "submissions.submitBy", select: "firstName lastName name email role" },
      { path: "feedbacks.submitBy", select: "firstName lastName name email role" },
      {
        path: "applicationId",
        populate: { path: "courseId", select: "name" },
        match: {
          courseId: courseIdFilter ? courseIdFilter : { $in: courseIds },
          ...(termIdFilter && { intakeId: termIdFilter }), // 🟢 filter by term (intake)
        },
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
  const limitParam = query.limit === "all" ? total : Number(query.limit) || 10;

  const paginatedResult =
    query.limit === "all"
      ? filteredResult
      : filteredResult.slice((page - 1) * limitParam, page * limitParam);

  const totalPage = limitParam > 0 ? Math.ceil(total / limitParam) : 1;

  const meta = { page, limit: limitParam, total, totalPage };

  return { meta, result: paginatedResult };
};


const getStudentAssignmentFeedbackFromDB = async (
  studentId: string,
  query: Record<string, unknown>
) => {
 
  const AssignmentQuery = new QueryBuilder(
    Assignment.find({
      studentId,
      status: { $in: ["feedback_given", "resubmission_required", "completed"]  },
    }).populate([
      {
        path: "studentId",
        select: "firstName title initial lastName name email",
      },
      {
        path: "feedbacks.submitBy",
        select: "firstName lastName name email role", // who gave feedback
      },
      {
        path: "applicationId",
        populate: {
          path: "courseId",
          select: "name",
        },
      },
      {
        path: "unitId",
        select: "title",
      },
      {
        path: "unitMaterialId",
        select: "assignments",
      },
    ]),
    query
  )
    .search(AssignmentSearchableFields)
    .filter(query)
    .sort()
    .fields()
    .paginate();

 
  const result = await AssignmentQuery.modelQuery;

  // 🟢 Step 4: Filter out completed assignments that have all feedback seen
  // Step 4: Filter out completed assignments that have all feedback seen
const filteredResult = result.filter((assignment: any) => {
  if (assignment.status === "completed") {
    // Check normal feedbacks
    const hasUnseenFeedback = assignment.feedbacks?.some(fb => !fb.seen);
    //  check finalFeedback
    const hasUnseenFinalFeedback = assignment.finalFeedback
      ? assignment.finalFeedback.seen === false
      : false;

       // Also check observationFeedback
    const hasUnseenObservationFeedback = assignment.observationFeedback
      ? assignment.observationFeedback.seen === false
      : false;

    return hasUnseenFeedback || hasUnseenFinalFeedback || hasUnseenObservationFeedback;
  }
  return true;
});

  // 🟢 Step 5: Handle limit and pagination manually (if `limit=all`)
  const total = filteredResult.length;
  const page = Number(query.page) || 1;
  const limitParam =
    query.limit === "all" ? total : Number(query.limit) || 10;

  const paginatedResult =
    query.limit === "all"
      ? filteredResult
      : filteredResult.slice((page - 1) * limitParam, page * limitParam);

  const totalPage = limitParam > 0 ? Math.ceil(total / limitParam) : 1;

  const meta = { page, limit: limitParam, total, totalPage };

  return { meta, result: paginatedResult };
};

// Students who submitted formative assignment
const getSubmittedAssignmentsFromDB = async (
  courseId: string,
  termId: string,
  unitId: string,
  query: Record<string, unknown>
) => {
  if (!courseId || !termId || !unitId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "courseId, termId, and unitId are required."
    );
  }

  const assignments = await Assignment.find({
    unitId,
    status: "submitted",
  })
    .populate([
      { path: "studentId", select: "firstName lastName email" },
      { path: "unitId", select: "title" },
      {
        path: "applicationId",
        populate:[
        { path: "courseId", select: "name" },
        { path: "intakeId", select: "termName" }
      ],
        match: { courseId, intakeId: termId },
      },
    ])
    .lean();

  const filtered = assignments.filter(a => a.applicationId);

  const result = filtered.map(a => ({
    student: {
      _id: a.studentId._id,
      name: `${a.studentId.firstName} ${a.studentId.lastName}`,
      email: a.studentId.email,
    },
    applicationId: a.applicationId,
    course: a.applicationId.courseId,
    term: a.applicationId.intakeId,
    unit: a.unitId,
  }));

  const meta = { total: result.length };
  return { meta, result };
};

// Students who received feedback (with teacher)
const getFeedbackReceivedAssignmentsFromDB = async (
  courseId: string,
  termId: string,
  unitId: string,
  query: Record<string, unknown>
) => {
  const AssignmentQuery = new QueryBuilder(
    Assignment.find({ "feedbacks.0": { $exists: true }, unitId }).populate([
      { path: "studentId", select: "firstName lastName email" },
      { path: "unitId", select: "title" },
      {
        path: "feedbacks.submitBy",
        select: "firstName lastName name email role",
      },
      { 
        path: "applicationId", 
        populate: [
        { path: "courseId", select: "name" },
        { path: "intakeId", select: "termName" }
      ],
        match: { courseId, intakeId: termId },
      },
    ]),
    query
  )
    .filter(query)
    .sort()
    .fields()
    .paginate();

  const result = await AssignmentQuery.modelQuery;
  const meta = await AssignmentQuery.countTotal();

  const processedResult = result.map((assignment: any) => {
    if (assignment.feedbacks && assignment.feedbacks.length > 0) {
      assignment.feedbacks.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      assignment.latestFeedback = assignment.feedbacks[0];
    } else {
      assignment.latestFeedback = null;
    }
    return assignment;
  });

  return { meta, result: processedResult };
};

// Students who did NOT submit formative assignment
const getNotSubmittedAssignmentsFromDB = async (
  courseId: string,
  termId: string,
  unitId: string,
  query: Record<string, unknown>
) => {
  if (!courseId || !termId || !unitId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "courseId, termId, and unitId are required."
    );
  }

  const applications = await ApplicationCourse.find({
    courseId,
    intakeId: termId,
    status: "approved",
  })
    .populate("studentId", "firstName lastName email")
    .populate("courseId", "name")     
    .populate("intakeId", "termName")
    .lean();

  if (!applications.length) {
    return { meta: { total: 0 }, result: [] };
  }

  const applicationIds = applications.map(app => app._id);

  const submittedAssignments = await Assignment.find({
    applicationId: { $in: applicationIds },
    unitId,
    status: { $in: ["submitted", "feedback_given", "completed", "resubmission_required"] },
  })
    .select("applicationId studentId unitId")
    .populate("unitId", "title") // ← Populate unit details
    .lean();

  const submittedStudentIds = new Set(
    submittedAssignments.map(a => a.studentId.toString())
  );

  const notSubmitted = applications.filter(
    (app: any) => !submittedStudentIds.has(app.studentId._id.toString())
  );

  const result = notSubmitted.map((app: any) => ({
    student: {
      _id: app.studentId._id,
      name: `${app.studentId.firstName} ${app.studentId.lastName}`,
      email: app.studentId.email,
    },
    applicationId: app,
    course: app.courseId,
    term: app.intakeId,
    unit: submittedAssignments.find(sa => sa.unitId._id.toString() === unitId.toString())?.unitId || { _id: unitId },
  }));

  const meta = { total: result.length };
  return { meta, result };
};


// Students who did NOT receive feedback
const getNoFeedbackAssignmentsFromDB = async (
  courseId: string,
  termId: string,
  unitId: string,
  query: Record<string, unknown>
) => {
  const AssignmentQuery = new QueryBuilder(
    Assignment.find({
      $or: [{ feedbacks: { $size: 0 } }, { feedbacks: { $exists: false } }],
      status: { $in: ["submitted"] },
      unitId,
    }).populate([
      { path: "studentId", select: "firstName lastName email" },
      { path: "unitId", select: "title" },
      { 
        path: "applicationId", 
        populate: [
        { path: "courseId", select: "name" },
        { path: "intakeId", select: "termName" }
      ],
        match: { courseId, intakeId: termId },
      },
    ]),
    query
  )
    .filter(query)
    .sort()
    .fields()
    .paginate();

  const result = await AssignmentQuery.modelQuery;
  const meta = await AssignmentQuery.countTotal();

  return { meta, result };
};


export const AssignmentServices = {
  getAllAssignmentFromDB,
  getSingleAssignmentFromDB,
  updateAssignmentIntoDB,
  createAssignmentIntoDB,
  getTeacherAssignmentFeedbackFromDB,
  getStudentAssignmentFeedbackFromDB,
  getSubmittedAssignmentsFromDB,
  getNotSubmittedAssignmentsFromDB,
  getFeedbackReceivedAssignmentsFromDB,
  getNoFeedbackAssignmentsFromDB,
};
