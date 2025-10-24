import { Types } from "mongoose";

export interface TCourse {
  name: string;
  courseCode:string;
  description:string;
  status:0 |1;
}