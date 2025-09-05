import { Types } from "mongoose";

export interface TCourse {
  name: string;
  courseCode:string
  status:0 |1;
}