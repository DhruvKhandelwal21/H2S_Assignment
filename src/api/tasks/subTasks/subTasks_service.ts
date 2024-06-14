import { Db, ObjectId, ReturnDocument } from "mongodb";
import { ObjectIdWithErrorHandler, updateCompose } from "../../../helper";

const commonUserId = ObjectIdWithErrorHandler("666c19dc4a86eedd7b998fea");
const findAll = async (db: Db, taskId: string) => {
  const aggregate = [
    {
      $match: {
        _id: commonUserId,
        "tasks._id": ObjectIdWithErrorHandler(taskId),
      },
    },
    {
      $unwind: "$tasks",
    },
    {
      $unwind: "$tasks.subTasks"
    },
    {
      $match: {
          "tasks.subTasks.deletion": { $ne: true },
        },
    },
    {
      $replaceRoot: { newRoot: "$tasks.subTasks" },
    },
  ];
  const data = await db.collection("Users").aggregate(aggregate).toArray();
  return data;
};

const create = async (db: Db, payload: any, taskId: string) => {
  const data = await db.collection("Users").findOneAndUpdate(
    {
      _id: commonUserId,
    },
    {
      $push: {
        "tasks.$[elem].subTasks": {
          ...payload,
          _id: new ObjectId(),
          deletion: false,
        },
      },
    },
    {
      arrayFilters: [{ "elem._id": ObjectIdWithErrorHandler(taskId) }],
    }
  );
  return data;
};

const update = async (
  db: Db,
  payload: any,
  taskId: string,
  subTaskId: string
) => {
  const data = await db.collection("Users").findOneAndUpdate(
    {
      _id: commonUserId,
      "tasks._id": ObjectIdWithErrorHandler(taskId),
    },
    {
      $set: {
        ...updateCompose("tasks.$[elem].subTasks.$[subElem]", payload),
      },
    },
    {
      arrayFilters: [
        { "elem._id": ObjectIdWithErrorHandler(taskId) },
        { "subElem._id": ObjectIdWithErrorHandler(subTaskId) },
      ],
    },
  );
  return data;
};

const remove = async (db: Db, taskId: string, subTaskId: string) => {
  const data = await db.collection("Users").findOneAndUpdate(
    {
      _id: commonUserId,
      "tasks._id": ObjectIdWithErrorHandler(taskId),
    },
    {
      $set: {
        "tasks.$[elem].subTasks.$[subElem].deletion": true,
      },
    },
    {
      arrayFilters: [
        { "elem._id": ObjectIdWithErrorHandler(taskId) },
        { "subElem._id": ObjectIdWithErrorHandler(subTaskId) },
      ],
    }
  );
  return data;
};

export default {
  findAll,
  create,
  update,
  remove,
};
