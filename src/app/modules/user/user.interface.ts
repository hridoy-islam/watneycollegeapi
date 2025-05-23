/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { USER_ROLE } from "./user.constant";
import e from "express";

export interface BrowserInfo {
  name?: string;
  version?: string;
}

export interface OSInfo {
  name?: string;
  version?: string;
}

export interface DeviceInfo {
  model?: string;
  type?: string;
  vendor?: string;
}

export interface CPUInfo {
  architecture?: string;
}

export interface UserAgentInfo {
  browser?: BrowserInfo;
  os?: OSInfo;
  device?: DeviceInfo;
  cpu?: CPUInfo;
  ipAddress: string;
  macAddress: string;
  timestamp?: Date;
}

export interface PersonalDetails {
  title: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  gender: string;
  dateOfBirth: Date;
  nationality: string;
  ethnicity: string;
  customEthnicity?: string;
  countryOfBirth: string;
  maritalStatus: string;
}

export interface AddressData {
  residentialAddressLine1: string;
  residentialAddressLine2?: string;
  residentialCity: string;
  residentialPostCode: string;
  residentialCountry: string;

  sameAsResidential: boolean;
  postalAddressLine1?: string;
  postalAddressLine2?: string;
  postalCity?: string;
  postalPostCode?: string;
  postalCountry?: string;
}

export interface ContactData {
  contactNumber: string;
  email: string;
  confirmEmail: string;
  preferredContactMethod: string;

  emergencyContactNumber: string;
  emergencyEmail: string;
  emergencyFullName: string;
  emergencyRelationship: string;
}

export interface ComplianceData {
  startDateInUK?: Date;
  niNumber?: string;
  status: string;
  ltrCode?: string;
  disability: string;
  disabilityDetails?: string;
  benefits: string;
  criminalConviction: string;
  convictionDetails?: string;
  studentFinance: string;
}

export interface DocumentsData {
  hasPassport?: boolean;
  passportNumber?: string;
  passportExpiry?: string;
  idDocument?: any;

  hasCertificates?: boolean;
  certificatesDetails?: string;
  qualificationCertificates?: any;

  cvResume?: any;

  hasProofOfAddress?: boolean;
  proofOfAddressType?: string;
  proofOfAddressDate?: string;
  proofOfAddress?: any;

  otherDocuments?: any;
  otherDocumentsDescription?: string;
}

export interface EmploymentData {
  isEmployed: string;
  currentEmployment?: {
    employer?: string;
    jobTitle?: string;
    startDate?: string;
    employmentType?: string;
    responsibilities?: string;
    supervisor?: string;
    contactPermission?: string;
  };
  previousEmployments?: {
    employer: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    reasonForLeaving: string;
    responsibilities: string;
    contactPermission: string;
  }[];
  hasEmploymentGaps: string;
  employmentGapsExplanation?: string;
  declaration: true;
}

export interface TermsData {
  acceptTerms: boolean;
  acceptDataProcessing: boolean;
}

export interface EducationEntry {
  institution: string;
  studyType: string; 
  qualification: string;
  awardDate: Date;
  certificate?: string; 
  transcript?: string;
}

interface CourseDetail {
  course: string; 
  intake: string; 
}


export interface emergencyContactData{
  emergencyContactNumber: string,
  emergencyEmail: string,
  emergencyFullName: string,
  emergencyRelationship: string,
}


export interface TUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "student";
  status: "block" | "active";
  isDeleted: boolean;
  authorized: boolean;
  address?: string;
  image?: string; 
  phone?: string;
  googleUid?: string;
  otp?: string;
  refreshToken?: string;
  otpExpiry: Date;
  isUsed: boolean;
  isValided: boolean;
  userAgentInfo: UserAgentInfo[];
  
  // Additional fields
  personalDetails?: PersonalDetails;
  addressData?: AddressData;
  contactData?: ContactData;
  complianceData?: ComplianceData;
  documentsData?: DocumentsData;
  employmentData?: EmploymentData;
  termsData?: TermsData;
  educationData?: EducationEntry;
  courseDetailsData?: CourseDetail;
  emergencyContactData: emergencyContactData;
    createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExists(email: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;