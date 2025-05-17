/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import config from "../../config";
import { UserStatus } from "./user.constant";
import { TUser, UserModel } from "./user.interface";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: ["user", "admin", "student"],
      default: "student",
    },
    status: {
      type: String,
      enum: UserStatus,
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    authorized: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    googleUid: {
      type: String,
    },
    otp: {
      type: String,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    isValided: {
      type: Boolean,
      default: false,
    },
    userAgentInfo: {
      type: [
        {
          browser: {
            name: { type: String },
            version: { type: String },
          },
          os: {
            name: { type: String },
            version: { type: String },
          },
          device: {
            model: { type: String },
            type: { type: String },
            vendor: { type: String },
          },
          cpu: {
            architecture: { type: String },
          },
          ipAddress: {
            type: String,
            required: true,
          },
          macAddress: {
            type: String,
            required: true,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
      select: false,
    },
    // Personal Details
    personalDetails: {
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
      studentType: { type: String },
    },
    // Address Data
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
 
    emergencyContactData: {
      emergencyContactNumber: { type: String },
      emergencyEmail: { type: String },
      emergencyFullName: { type: String },
      emergencyRelationship: { type: String },
      emergencyAddress: { type: String },
    },
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
    documentsData: {
      hasPassport: { type: Boolean },
      passportNumber: { type: String },
      passportExpiry: { type: String },
      idDocument: { type: [String], default: [] },
      hasCertificates: { type: Boolean },
      certificatesDetails: { type: String },
      qualificationCertificates: { type: [String], default: [] },
      cvResume: { type: [String], default: [] },
      hasProofOfAddress: { type: Boolean },
      proofOfAddressType: { type: String },
      proofOfAddressDate: { type: String },
      proofOfAddress: { type: [String], default: [] },
      otherDocuments: { type: [String], default: [] },
      otherDocumentsDescription: { type: String },
    },
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
      educationData: {
        type: [
          {
            institution: { type: String, required: true },
            studyType: { type: String, required: true },
            qualification: { type: String, required: true },
            awardDate: { type: Date, required: true },
            certificate: { type: String, default: null },
            transcript: { type: String, default: null },
          },
        ],
        default: [],
      },
      englishQualification: {
        englishTestType: { type: String, default: null },
        englishTestScore: { type: String, default: null },
        englishTestDate: { type: Date, default: null },
        englishCertificate: { type: String, default: null },
      },
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

userSchema.statics.hashPassword = async function (
  plainTextPassword: string
): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(
      plainTextPassword,
      Number(config.bcrypt_salt_rounds)
    );
    return hashedPassword;
  } catch (error) {
    throw new Error("Error while hashing the password");
  }
};

userSchema.pre("save", async function (next) {
  const user = this; // doc
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

// set '' after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isUserExists = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>("User", userSchema);
