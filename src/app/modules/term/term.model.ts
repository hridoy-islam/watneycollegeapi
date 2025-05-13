import mongoose, { Schema, Document } from "mongoose";
import { TTerm } from "./term.interface";

const TermSchema = new Schema<TTerm & Document>(
  {
    termName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Number,
      enum: [0, 1], 
      default: 1,
    },
  },
  { timestamps: true }
);

const Term = mongoose.model<TTerm & Document>("Term", TermSchema);
export default Term;
