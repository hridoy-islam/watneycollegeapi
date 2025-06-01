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
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // search(searchableFields: string[]) {
    //   const searchTerm = this?.query?.searchTerm;
    //   if (searchTerm) {
    //     this.modelQuery = this.modelQuery.find({
    //       $or: searchableFields.map(
    //         (field) =>
    //           ({
    //             [field]: { $regex: searchTerm, $options: "i" },
    //           }) as FilterQuery<T>
    //       ),
    //     });
    //   }
    //   return this;
    // }
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            const searchTerms = searchTerm
                .split(" ")
                .filter((term) => term.trim() !== ""); // Split into individual terms
            // Create an array of conditions for each term
            const searchConditions = searchTerms.map((term) => ({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: term, $options: "i" }, // Case-insensitive regex for each field
                })),
            }));
            // Combine all conditions with $and to ensure all terms are matched
            if (searchConditions.length > 0) {
                this.modelQuery = this.modelQuery.find({
                    $and: searchConditions,
                });
            }
        }
        return this;
    }
    filter(filters) {
        const queryObj = Object.assign({}, this.query); // copy
        // Filtering
        const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    sort() {
        var _a, _b, _c;
        const sort = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(",")) === null || _c === void 0 ? void 0 : _c.join(" ")) || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        var _a, _b;
        const limitParam = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.limit;
        const page = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.page) || 1;
        if (limitParam === "all") {
            // Return all records: no limit, no skip
            this.modelQuery = this.modelQuery.skip(0); // Optional: skip(0) for consistency
        }
        else {
            const limit = Number(limitParam) || 10;
            const skip = (page - 1) * limit;
            this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        }
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(",")) === null || _c === void 0 ? void 0 : _c.join(" ")) || "-__v";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    countTotal() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const limitParam = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.limit;
            const totalQueries = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(totalQueries);
            const page = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.page) || 1;
            // const limit = Number(this?.query?.limit) || 10;
            const limit = limitParam === "all" ? total : Number(limitParam) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                page,
                limit,
                total,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
