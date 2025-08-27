import { Types } from "mongoose";

export interface TEmail{
  emailDraft: Types.ObjectId,
  userId: Types.ObjectId;
  issuedBy:Types.ObjectId;
  to: string;
  subject: string;
  body: string;
  status:"pending"|"sent";
  
  
}