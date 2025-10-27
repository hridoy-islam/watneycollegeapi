import { Types } from "mongoose";

export interface TLogs {
  userId: Types.ObjectId;
  action: string;
  description: { type: String };
  loginAt: { type: Date };
  logoutAt: { type: Date };
}
