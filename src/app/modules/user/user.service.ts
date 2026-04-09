import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { UserSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppError";
import config from "../../config";
import bcrypt from "bcrypt";

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter(query)
    .sort()
    .paginate()
    .fields();

  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;

  return {
    meta,
    result,
  };
};

// const getSingleUserFromDB = async (id: string) => {
//   const result = await User.findById(id);
//   return result;
// };

const getSingleUserFromDB = async (id: string, query: Record<string, unknown> = {}) => {
  // Parse the requested fields from query
  const fields = typeof query.fields === 'string' 
    ? query.fields.split(',').map(f => f.trim()).join(' ')
    : undefined;
  
  // Build the query
  let userQuery = User.findById(id);
  
  // Only apply select if fields are provided
  if (fields) {
    userQuery = userQuery.select(fields);
  }
  
  const result = await userQuery;
  
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  
  return result;
};



const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
 
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  // Check if any part of the name is being updated
  const isNameUpdating = 
    payload.title !== undefined || 
    payload.firstName !== undefined || 
    payload.initial !== undefined || 
    payload.lastName !== undefined;

  if (isNameUpdating) {
    // Merge the incoming payload data with the existing user data
    const title = payload.title !== undefined ? payload.title : user.title;
    const firstName = payload.firstName !== undefined ? payload.firstName : user.firstName;
    const initial = payload.initial !== undefined ? payload.initial : user.initial;
    const lastName = payload.lastName !== undefined ? payload.lastName : user.lastName;

    // Filter out undefined/empty values and join them with a single space
    payload.name = [title, firstName, initial, lastName].filter(Boolean).join(" ");
  }

  
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};



export const UserServices = {
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  
};
