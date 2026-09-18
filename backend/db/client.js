import mongoose from "mongoose";
import { connectDatabase } from "./connection.js";
import { getModel, models, refFields } from "./models.js";

const idFields = new Set([
  "id",
  "userId",
  "skillId",
  "userSkillId",
  "swapRequestId",
  "swapClassId",
  "chatRoomId",
  "reviewId",
  "badgeId",
  "calendarEventId",
  "reportId",
  "todoId",
  "resourceId",
  "snippetId",
  "fileId",
]);

const toMongoValue = (value) =>
  value && typeof value === "object" && value.$in
    ? { $in: value.$in.map(toMongoValue) }
    : value;

const isMongoObjectId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const usesMongoObjectId = (value) => {
  if (isMongoObjectId(value)) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return Object.values(value).some((operand) =>
    Array.isArray(operand)
      ? operand.some(isMongoObjectId)
      : isMongoObjectId(operand),
  );
};

const translateWhere = (where = {}) => {
  if (!where || typeof where !== "object") return {};
  const result = {};
  for (const [key, value] of Object.entries(where)) {
    if (key === "AND")
      result.$and = (Array.isArray(value) ? value : [value]).map(
        translateWhere,
      );
    else if (key === "OR")
      result.$or = (Array.isArray(value) ? value : [value]).map(translateWhere);
    else if (key === "NOT")
      result.$nor = (Array.isArray(value) ? value : [value]).map(
        translateWhere,
      );
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      const next = {};
      for (const [operator, operand] of Object.entries(value)) {
        const map = {
          in: "$in",
          notIn: "$nin",
          not: "$ne",
          lt: "$lt",
          lte: "$lte",
          gt: "$gt",
          gte: "$gte",
          contains: "$regex",
        };
        if (operator === "contains")
          next.$regex = new RegExp(String(operand), "i");
        else if (map[operator]) next[map[operator]] = toMongoValue(operand);
        else next[operator] = translateWhere(operand);
      }
      result[key === "id" && usesMongoObjectId(value) ? "_id" : key] = next;
    } else
      result[key === "id" && usesMongoObjectId(value) ? "_id" : key] =
        toMongoValue(value);
  }
  return result;
};

const getUniqueWhere = (where = {}) => {
  const entries = Object.entries(where);
  return translateWhere(where);
};

const normalizeOrderBy = (orderBy = {}) => {
  if (!Array.isArray(orderBy)) return orderBy;

  return Object.fromEntries(
    orderBy.flatMap((entry) => Object.entries(entry || {})),
  );
};

const Counter =
  mongoose.models.SkillSwapCounter ||
  mongoose.model(
    "SkillSwapCounter",
    new mongoose.Schema(
      { _id: String, value: { type: Number, default: 0 } },
      { versionKey: false },
    ),
    "SkillSwapCounter",
  );

const getNextLegacyId = async (name, field) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: `${name}:${field}` },
    { $inc: { value: 1 } },
    { upsert: true, new: true },
  )
    .lean()
    .exec();
  return counter.value;
};

const normalizeCreateData = async (name, data = {}) => {
  const normalized = { ...data };
  const legacyIdField = name === "Users" ? "userId" : "id";
  if (
    normalized[legacyIdField] === undefined ||
    normalized[legacyIdField] === null
  ) {
    normalized[legacyIdField] = await getNextLegacyId(name, legacyIdField);
  }
  return normalized;
};

const normalizeUpdateData = (data = {}) => {
  const set = {};
  const inc = {};
  for (const [key, value] of Object.entries(data)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      value.increment !== undefined
    ) {
      inc[key] = value.increment;
    } else {
      set[key] = value;
    }
  }
  const update = {};
  if (Object.keys(set).length) update.$set = set;
  if (Object.keys(inc).length) update.$inc = inc;
  return update;
};

const populateIncludes = (query, include = {}) => {
  query.setOptions({ strictPopulate: false });
  for (const [field, options] of Object.entries(include || {})) {
    if (!refFields.has(field)) continue;
    query = query.populate({
      path: field,
      strictPopulate: false,
      ...(options?.select
        ? {
            select: Object.keys(options.select)
              .filter((key) => options.select[key])
              .join(" "),
          }
        : {}),
    });
  }
  return query;
};

const delegate = (name) => {
  const Model = getModel(name);
  const run = (query, args = {}) => populateIncludes(query, args.include);
  return {
    findUnique: async (args = {}) =>
      run(Model.findOne(getUniqueWhere(args.where)), args).exec(),
    findFirst: async (args = {}) =>
      run(
        Model.findOne(translateWhere(args.where)).sort(
          normalizeOrderBy(args.orderBy),
        ),
        args,
      ).exec(),
    findMany: async (args = {}) =>
      run(
        Model.find(translateWhere(args.where))
          .sort(normalizeOrderBy(args.orderBy))
          .skip(args.skip || 0)
          .limit(args.take || 0),
        args,
      )
        .lean()
        .exec(),
    count: async (args = {}) =>
      Model.countDocuments(translateWhere(args.where)),
    create: async (args = {}) =>
      Model.create(await normalizeCreateData(Model.modelName, args.data)),
    createMany: async (args = {}) => ({
      count: (
        await Model.insertMany(
          await Promise.all(
            (args.data || []).map((data) =>
              normalizeCreateData(Model.modelName, data),
            ),
          ),
        )
      ).length,
    }),
    update: async (args = {}) =>
      run(
        Model.findOneAndUpdate(
          getUniqueWhere(args.where),
          normalizeUpdateData(args.data),
          { new: true },
        ),
        args,
      ).exec(),
    updateMany: async (args = {}) =>
      Model.updateMany(
        translateWhere(args.where),
        normalizeUpdateData(args.data),
      ),
    delete: async (args = {}) =>
      Model.findOneAndDelete(getUniqueWhere(args.where)).exec(),
    deleteMany: async (args = {}) =>
      Model.deleteMany(translateWhere(args.where)),
    upsert: async (args = {}) => {
      const update = normalizeUpdateData(args.update);
      const create = await normalizeCreateData(Model.modelName, args.create);
      const updateFields = new Set([
        ...Object.keys(update.$set || {}),
        ...Object.keys(update.$inc || {}),
      ]);
      const insertOnly = Object.fromEntries(
        Object.entries(create).filter(([key]) => !updateFields.has(key)),
      );

      return run(
        Model.findOneAndUpdate(
          getUniqueWhere(args.where),
          {
            ...update,
            $setOnInsert: insertOnly,
          },
          { upsert: true, new: true },
        ),
        args,
      ).exec();
    },
    aggregate: async (args = {}) => {
      const rows = await Model.find(translateWhere(args.where)).lean().exec();
      const result = {};
      if (args._count)
        result._count = Object.fromEntries(
          Object.keys(rows[0] || {}).map((key) => [key, rows.length]),
        );
      if (args._max)
        result._max = Object.fromEntries(
          Object.keys(args._max).map((key) => [
            key,
            rows.reduce((max, row) => (row[key] > max ? row[key] : max), null),
          ]),
        );
      if (args._avg)
        result._avg = Object.fromEntries(
          Object.keys(args._avg).map((key) => [
            key,
            rows.length
              ? rows.reduce((sum, row) => sum + Number(row[key] || 0), 0) /
                rows.length
              : null,
          ]),
        );
      return result;
    },
    groupBy: async () => [],
  };
};

const db = new Proxy(
  {
    $connect: connectDatabase,
    $disconnect: async () => mongoose.disconnect(),
    $transaction: async (work) =>
      typeof work === "function" ? work(db) : Promise.all(work),
    models,
  },
  {
    get(target, property) {
      return target[property] || delegate(property);
    },
  },
);

export default db;
