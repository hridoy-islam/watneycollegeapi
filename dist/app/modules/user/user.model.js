"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
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
        enum: user_constant_1.UserStatus,
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
    // Contact Data
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
        type: [{
                institution: { type: String, required: true },
                studyType: { type: String, required: true },
                qualification: { type: String, required: true },
                awardDate: { type: Date, required: true },
                certificate: { type: String, optional: true },
                transcript: { type: String, optional: true }
            }],
        default: []
    },
    // Course Details
    courseDetailsData: {
        type: {
            course: { type: String, required: true },
            intake: { type: String, required: true },
        },
    },
}, {
    timestamps: true,
});
userSchema.statics.hashPassword = function (plainTextPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashedPassword = yield bcrypt_1.default.hash(plainTextPassword, Number(config_1.default.bcrypt_salt_rounds));
            return hashedPassword;
        }
        catch (error) {
            throw new Error("Error while hashing the password");
        }
    });
};
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this; // doc
        if (user.isModified("password")) {
            user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    });
});
// set '' after saving password
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
userSchema.statics.isUserExists = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }).select("+password");
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.User = (0, mongoose_1.model)("User", userSchema);
