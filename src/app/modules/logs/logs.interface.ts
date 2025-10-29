import { Types } from "mongoose";

export interface TBreak {
  breakStart: Date;
  breakEnd?: Date;
}
export interface TLogs {
  userId: Types.ObjectId;
  action: string;
  description: { type: String };
  clockIn: { type: Date };
  clockOut: { type: Date };
  breaks:TBreak[]
}
