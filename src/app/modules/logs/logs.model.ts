import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import { TLogs } from "./logs.interface";

const LogsSchema = new Schema<TLogs & Document>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    action: {
      type: String,
      enum: ["login", "logout"],
      default: "login",
    },

    description: { type: String },

    loginAt: { type: Date },
    logoutAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Logs = mongoose.model<TLogs & Document>("Logs", LogsSchema);
export default Logs;
