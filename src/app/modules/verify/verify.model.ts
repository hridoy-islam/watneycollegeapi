import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import { TVerify } from "./verify.interface";

const VerifySchema = new Schema(
  {
    name: { type: String, required: true },
    studentId: { type: String, required: true },
    documents: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Verify = mongoose.model<TVerify & Document>("Verify", VerifySchema);
export default Verify;
