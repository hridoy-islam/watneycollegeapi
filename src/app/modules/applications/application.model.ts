/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import { Schema, Types, model } from "mongoose";
import config from "../../config";
import { TApplication } from "./application.interface";

const ApplicationSchema = new Schema<TApplication>(
  {
    seen: { type: Boolean, default: false },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    personalDetailsData: {
      title: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      otherName: { type: String },
      gender: { type: String },
      dateOfBirth: { type: Date },
      nationality: { type: String },
      ethnicity: { type: String },
      customEthnicity: { type: String },
      countryOfBirth: { type: String },
      maritalStatus: { type: String },
    },
    addressData: {
      residentialAddressLine1: { type: String },
      residentialAddressLine2: { type: String },
      residentialCity: { type: String },
      residentialPostCode: { type: String },
      residentialCountry: { type: String },
      sameAsResidential: { type: Boolean },
      postalAddressLine1: { type: String },
      postalAddressLine2: { type: String },
      postalCity: { type: String },
      postalPostCode: { type: String },
      postalCountry: { type: String },
    },
    contactData: {
      contactNumber: { type: String },
      email: { type: String },
      confirmEmail: { type: String },
      preferredContactMethod: { type: String },
    },
    emergencyContactData: {
      emergencyContactNumber: { type: String },
      emergencyEmail: { type: String },
      emergencyFullName: { type: String },
      emergencyRelationship: { type: String },
    },
    // Compliance Data
    complianceData: {
      startDateInUK: { type: Date },
      niNumber: { type: String },
      status: { type: String },
      ltrCode: { type: String },
      disability: { type: String },
      disabilityDetails: { type: String },
      benefits: { type: String },
      criminalConviction: { type: String },
      convictionDetails: { type: String },
      studentFinance: { type: String },
    },
    // Documents Data
    documentsData: {
      documentType: { type: String },                 // 'passport' or 'nationalId'
      nationalID: { type: String },
      hasDocument: { type: Boolean, default: true },
      passportNumber: { type: String },
      passportExpiry: { type: String },
      idDocument: [{ type: String }],                // Single file path or URL
      hasCertificates: { type: Boolean, default: true },
      certificatesDetails: [{ type: String }],       // Array of strings
      qualificationCertificates: [{ type: String }], // Single file
      cvResume: [{ type: String }],                  // Single file
      hasProofOfAddress: { type: Boolean, default: true },
      proofOfAddressType: { type: String },
      proofOfAddressDate: { type: String },
      proofOfAddress: [{ type: String }],            // Single file
      otherDocuments: [{ type: String }],            // Single file
      otherDocumentsDescription: [{ type: String }],
    },
    
    // Employment Data
    employmentData: {
      isEmployed: { type: String },
      currentEmployment: {
        employer: { type: String },
        jobTitle: { type: String },
        startDate: { type: String },
        employmentType: { type: String },
        responsibilities: { type: String },
        supervisor: { type: String },
        contactPermission: { type: String },
      },
      previousEmployments: [
        {
          employer: { type: String },
          jobTitle: { type: String },
          startDate: { type: String },
          endDate: { type: String },
          reasonForLeaving: { type: String },
          responsibilities: { type: String },
          contactPermission: { type: String },
        },
      ],
      hasEmploymentGaps: { type: String },
      employmentGapsExplanation: { type: String },
      declaration: { type: Boolean, default: false },
    },
    // Terms Data
    termsData: {
      acceptTerms: { type: Boolean, default: false },
      acceptDataProcessing: { type: Boolean, default: false },
    },
    educationData: {
      type: [
        {
          institution: { type: String, required: true },
          studyType: { type: String, required: true },
          qualification: { type: String, required: true },
          awardDate: { type: Date, required: true },
          certificate: { type: String, optional: true },
          transcript: { type: String, optional: true },
        },
      ],
      default: [],
    },
    // Course Details
    courseDetailsData: {
      type: {
        course: { type: String, required: true },
        intake: { type: String, required: true },
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Application = model<TApplication>(
  "Application",
  ApplicationSchema
);
