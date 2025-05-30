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
      enum: ["user", "admin", "student", "applicant"],
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
    isCompleted: {
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
    title: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    otherName: { type: String },
    initial: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    ethnicity: { type: String },
    customEthnicity: { type: String },
    countryOfDomicile: { type: String },
    countryOfBirth: { type: String },
    maritalStatus: { type: String },
    studentType: { type: String },
    requireVisa: { type: String },
    applicationLocation: { type: String },
    isBritishCitizen: { type: String },
    shareCode: { type: String },
    nationalInsuranceNumber: { type: String },
    countryOfResidence: { type: String },
    postalAddress: {
      line1: { type: String },
      line2: { type: String }, // optional
      city: { type: String },
      postCode: { type: String },
      country: { type: String },
    },
    // Address Data
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

    // Emergency Contact
    emergencyContactNumber: { type: String },
    emergencyEmail: { type: String },
    emergencyFullName: { type: String },
    emergencyRelationship: { type: String },
    emergencyAddress: { type: String },

    // Compliance
    startDateInUK: { type: Date },
    niNumber: { type: String },
    immigrationStatus: { type: String },
    ltrCode: { type: String },
    
    benefits: { type: String },
    criminalConviction: { type: Boolean },
    convictionDetails: { type: String },
    studentFinance: { type: String },
    visaRequired: { type: String },
    enteredUKBefore: { type: String },
    completedUKCourse: { type: String },
    visaRefusal: { type: String },
    visaRefusalDetail: { type: String },

    // Documents
    hasPassport: { type: Boolean },
    passportNumber: { type: String },
    passportExpiry: { type: String },
    idDocument: { type: [String], default: [] },
    hasCertificates: { type: Boolean },
    certificatesDetails: { type: [String], default: [] },
    qualificationCertificates: { type: [String], default: [] },
    cvResume: { type: [String], default: [] },
    hasProofOfAddress: { type: Boolean },
    proofOfAddressType: { type: String },
    proofOfAddressDate: { type: String },
    proofOfAddress: { type: [String], default: [] },
    otherDocuments: { type: [String], default: [] },
    otherDocumentsDescription: { type: String },

    // Employment
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
    hasPreviousEmployment: { type: String },

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

    // Terms
    acceptTerms: { type: Boolean, default: false },
    acceptDataProcessing: { type: Boolean, default: false },

    // Education
    educationData: {
      type: [
        {
          institution: { type: String },
          qualification: { type: String },
          awardDate: { type: Date },
          grade: { type: String },
          certificate:{type: String}
        },
      ],
      default: [],
    },

    // Application Data
    availableFromDate: { type: Date },
    source: { type: String },

    // Weekly Availability
    availability: {
      type: Map,
      of: Boolean,
    },

    // Student and Pension Age
    isStudent: { type: Boolean },
    isUnderStatePensionAge: { type: Boolean },

    // Referral Info
    referralEmployee: { type: String },

    // Career Section Flags
    declarationCorrectUpload: { type: Boolean },
    declarationContactReferee: { type: Boolean },
    appliedBefore: { type: Boolean },

    criminalConvictionDetails: { type: String },

    // Disability and Adjustment Info
    disability: { type: String },
    disabilityDetails: { type: String },
    hasDisability: { type: Boolean },
    needsReasonableAdjustment: { type: Boolean },
    reasonableAdjustmentDetails: { type: String },
    dataProcessingAccepted: { type: Boolean },
    termsAccepted: { type: Boolean },
    referee1: {
      name: { type: String },
      organisation: { type: String },
      address: { type: String },
      relationship: { type: String },
      otherRelationship: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    referee2: {
      name: { type: String },
      organisation: { type: String },
      address: { type: String },
      relationship: { type: String },
      otherRelationship: { type: String },
      email: { type: String },
      phone: { type: String },
    },

    documents: {
      type: [
        {
          type: { type: String }, // Replace with DocumentType if it's an enum
          fileUrl: { type: String },
          customTitle: { type: String },
        },
      ],
      default: [],
    },

    englishQualification: {
      type: {
        englishTestType: { type: String },
        englishTestScore: { type: String },
        englishTestDate: { type: Date },
        englishCertificate: { type: String },
      },
    },

    // declarationCorrectUpload: { type: Boolean },
    // declarationContactReferee: { type: Boolean },
    // criminalConviction: { type: Boolean },
    // criminalConvictionDetails: { type: String },
    // appliedBefore: { type: Boolean },
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
