import { Db, ObjectId } from "mongodb";
import { ObjectIdWithErrorHandler, updateCompose } from "../../helper";

const commonUserId = ObjectIdWithErrorHandler("666c19dc4a86eedd7b998fea");
const findAll = async (db: Db) => {
  const aggregate = [
    {
      $match: {
        _id: commonUserId,
      },
    },
    {
      $unwind: "$tasks",
    },
    {
      $replaceRoot: { newRoot: "$tasks" },
    },
    {
      $match: {
        deletion: { $ne: true },
      },
    },
  ];
  const data = await db.collection("Users").aggregate(aggregate).toArray();
  return data;
};

const create = async (db: Db, payload: any) => {

  const data = await db.collection("Users").findOneAndUpdate(
    {
      _id: commonUserId,
    },
    {
      $push: { tasks: { ...payload, _id: new ObjectId(), deletion: false } },
    },
    {
      returnDocument: 'after'
    }
  );
  return data;
};

const update = async (db: Db, payload: any, taskId: string) => {
  const data = await db.collection("Users").findOneAndUpdate(
    {
      _id: commonUserId,
      "tasks._id": ObjectIdWithErrorHandler(taskId),
    },
    {
      $set: {
        ...updateCompose("tasks.$", payload),
      },
    },
    {
      returnDocument: 'after'
    }
  );
  return data;
};

const remove = async (db: Db, taskId: string) => {
  const data = await db.collection("Users").findOneAndUpdate(
    {
      _id: commonUserId,
      "tasks._id": ObjectIdWithErrorHandler(taskId),
    },
    {
      $set: {
        "tasks.$.deletion": true,
      },
    },
  );
  return data;
};

export default {
  findAll,
  create,
  update,
  remove,
};
