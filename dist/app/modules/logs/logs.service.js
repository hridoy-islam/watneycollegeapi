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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const logs_constant_1 = require("./logs.constant");
const logs_model_1 = __importDefault(require("./logs.model"));
const moment_1 = __importDefault(require("moment"));
const getAllLogsFromDB = (query, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromDate, toDate, userId } = query, restQuery = __rest(query, ["fromDate", "toDate", "userId"]);
    let finalQuery = Object.assign({}, restQuery);
    // Default: If no date range provided, show current month
    const now = (0, moment_1.default)();
    if (!fromDate && !toDate) {
        finalQuery.createdAt = {
            $gte: now.startOf('month').toDate(),
            $lte: now.endOf('month').toDate(),
        };
    }
    else if (fromDate || toDate) {
        const dateFilter = {};
        if (fromDate)
            dateFilter.$gte = (0, moment_1.default)(fromDate).startOf('day').toDate();
        if (toDate)
            dateFilter.$lte = (0, moment_1.default)(toDate).endOf('day').toDate();
        finalQuery.createdAt = dateFilter;
    }
    // Handle multiple userIds (comma-separated)
    if (userId) {
        const userIds = userId.split(',').map(id => id.trim());
        finalQuery.userId = { $in: userIds };
    }
    else if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'teacher') {
        // If current user is a teacher, show only their logs by default
        finalQuery.userId = currentUser._id;
    }
    const LogsQuery = new QueryBuilder_1.default(logs_model_1.default.find().populate("userId", "name"), finalQuery)
        .search(logs_constant_1.LogsSearchableFields)
        .filter(finalQuery)
        .sort()
        .paginate()
        .fields();
    const meta = yield LogsQuery.countTotal();
    const result = yield LogsQuery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleLogsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield logs_model_1.default.findById(id);
    return result;
});
const updateLogsIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, action, logoutAt } = payload;
    if (!userId || action !== "logout") {
        return null;
    }
    // Find the latest login log for this user
    const latestLoginLog = yield logs_model_1.default.findOne({ userId, action: "login" }).sort({
        createdAt: -1,
    });
    if (!latestLoginLog) {
        return null;
    }
    // Update that log entry
    const result = yield logs_model_1.default.findByIdAndUpdate(latestLoginLog._id, {
        action: "logout",
        logoutAt,
        // description: "User logged out successfully",
    }, { new: true, runValidators: true });
    return result;
});
const updateLogsByIdIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const logs = yield logs_model_1.default.findById(id);
    if (!logs_model_1.default) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Logs not found");
    }
    const result = yield logs_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const createLogsIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield logs_model_1.default.create(payload);
    return result;
});
exports.LogsServices = {
    getAllLogsFromDB,
    getSingleLogsFromDB,
    updateLogsIntoDB,
    createLogsIntoDB,
    updateLogsByIdIntoDB
};
