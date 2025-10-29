import mongoose, { Schema, Document } from "mongoose";
import { TLogs } from "./logs.interface";

const LogsSchema = new Schema<TLogs & Document>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    action: {
      type: String,
      enum: ["clockIn", "clockOut", "break"],
      default: "login",
    },

    description: { type: String },

    breaks: [
      {
        breakStart: { type: Date },
        breakEnd: { type: Date },
      },
    ],

    clockIn: { type: Date },
    clockOut: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Logs = mongoose.model<TLogs & Document>("Logs", LogsSchema);
export default Logs;
