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
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAllUserFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .search(user_constant_1.UserSearchableFields)
        .filter(query)
        .sort()
        .paginate()
        .fields();
    const meta = yield userQuery.countTotal();
    const result = yield userQuery.modelQuery;
    return {
        meta,
        result,
    };
});
// const getSingleUserFromDB = async (id: string) => {
//   const result = await User.findById(id);
//   return result;
// };
const getSingleUserFromDB = (id, query = {}) => __awaiter(void 0, void 0, void 0, function* () {
    // Parse the requested fields from query
    const fields = typeof query.fields === 'string'
        ? query.fields.split(',').map(f => f.trim()).join(' ')
        : undefined;
    // Build the query
    let userQuery = user_model_1.User.findById(id);
    // Only apply select if fields are provided
    if (fields) {
        userQuery = userQuery.select(fields);
    }
    const result = yield userQuery;
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return result;
});
const updateUserIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (payload.password) {
        payload.password = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.UserServices = {
    getAllUserFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
};
