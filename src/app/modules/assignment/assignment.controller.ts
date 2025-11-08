import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AssignmentServices } from "./assignment.service";

const getAllAssignment: RequestHandler = catchAsync(async (req, res) => {
  const result = await AssignmentServices.getAllAssignmentFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignments retrived succesfully",
    data: result,
  });
});
const getSingleAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AssignmentServices.getSingleAssignmentFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment is retrieved succesfully",
    data: result,
  });
});

const updateAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AssignmentServices.updateAssignmentIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment is updated succesfully",
    data: result,
  });
});

const createAssignment: RequestHandler = catchAsync(async (req, res) => {
  const result = await AssignmentServices.createAssignmentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Assignment created successfully",
    data: result,
  });
});

const getTeacherAssignmentFeedback= catchAsync(async (req, res) => {
  const {teacherId} = req.params; 
  const query = req.query;

  const result = await AssignmentServices.getTeacherAssignmentFeedbackFromDB(teacherId, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Teacher assignment feedback retrieved successfully",
    data: result,
  });
});

const getStudentAssignmentFeedback = catchAsync(async (req, res) => {
  const  {studentId}  = req.params;
  const result = await AssignmentServices.getStudentAssignmentFeedbackFromDB(
    studentId ,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student assignments with feedback fetched successfully",
    data: result,
  });
});


const getSubmittedAssignments = catchAsync(async (req, res) => {
  // ✅ All IDs come from query parameters
  const query = req.query;

  const { courseId, termId, unitId,assignmentId } = req.params;
 
  const result = await AssignmentServices.getSubmittedAssignmentsFromDB(courseId,termId,unitId,assignmentId,query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submitted assignments retrieved successfully",
    data: result,
  });
});

const getFeedbackReceivedAssignments = catchAsync(async (req, res) => {
  const query = req.query;
  const { courseId, termId, unitId,assignmentId } = req.params;

  const result = await AssignmentServices.getFeedbackReceivedAssignmentsFromDB(courseId, termId, unitId,assignmentId, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignments with feedback retrieved successfully",
    data: result,
  });
});

const getNotSubmittedAssignments = catchAsync(async (req, res) => {
  const query = req.query;
  const { courseId, termId, unitId,assignmentId } = req.params;

  const result = await AssignmentServices.getNotSubmittedAssignmentsFromDB(courseId, termId, unitId,assignmentId, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students who did not submit assignments retrieved successfully",
    data: result,
  });
});

const getNoFeedbackAssignments = catchAsync(async (req, res) => {
  const query = req.query;
  const { courseId, termId, unitId,assignmentId } = req.params;

  const result = await AssignmentServices.getNoFeedbackAssignmentsFromDB(courseId, termId, unitId,assignmentId, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students without feedback retrieved successfully",
    data: result,
  });
});
export const AssignmentControllers = {
  getAllAssignment,
  getSingleAssignment,
  updateAssignment,
  createAssignment,
  getTeacherAssignmentFeedback,
  getStudentAssignmentFeedback,
  getSubmittedAssignments,
  getNotSubmittedAssignments,
  getFeedbackReceivedAssignments,
  getNoFeedbackAssignments,
  
};
