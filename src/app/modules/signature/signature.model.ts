import mongoose, { Schema, Document, CallbackError, Types } from "mongoose";
import { TSignature } from "./signature.interface";

const SignatureSchema = new Schema({
  name: { type: String, required: true },
  signatureId: { type: String, required: true },
  documentUrl: { type: String, required: true },
});

// Apply the type at the model level

const Signature = mongoose.model<TSignature & Document>("Signature", SignatureSchema);
export default Signature;
