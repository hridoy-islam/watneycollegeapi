import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import {TEmail } from "./email.interface";

const emailSchema = new Schema(
  {
    emailDraft: { type: Types.ObjectId, ref: "EmailDraft" }, 
    userId: { type: Types.ObjectId, required: true, ref: "User" }, 
    issuedBy: { type: Types.ObjectId, required: true, ref: "User" }, 
    
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, enum: ["pending", "sent"], default: "pending" }, 
  },
  {
    timestamps: true, 
  }
);



const Email = mongoose.model<TEmail & Document>(
  "Email",
  emailSchema
);
export default Email;
