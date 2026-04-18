import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import { TVerify } from "./verify.interface";

const DocumentSchema = new Schema({
  fileName: { type: String },
  files: [{ type: String }],
});

const VerifySchema = new Schema(
  {
    name: { type: String, required: true },
    studentId: { type: String, required: true },
    dob: { type: String, required: true },
    documents: [DocumentSchema],
    applicationId: { type: Schema.Types.ObjectId, ref: "ApplicationCourse" },
  },
  {
    timestamps: true,
  },
);

const Verify = mongoose.model<TVerify & Document>("Verify", VerifySchema);
export default Verify;
