import { Db, ObjectId } from "mongodb";
import { ObjectIdWithErrorHandler, updateCompose } from "../../helper";
import ApiError from "../../utils/ApiError";
import { Task } from "../../interfaces/common.interface";

const commonUserId = ObjectIdWithErrorHandler("666c19dc4a86eedd7b998fea");

// matched the common user id and deconstructed tasks with unwind 
// followed by using match again for removing tasks with deletion set true
// filter operator -> for setting the updated subTasks with deletion set to false only.
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
    {
      $set : {
          subTasks : { $ifNull: [{$filter : { input : "$subTasks", as : "f", cond: { $ne: ["$$f.deletion", true] }}}, []] }}
      }
  ];
  const data = await db.collection("Users").aggregate(aggregate).toArray();
  return data;
};

const create = async (db: Db, payload: any): Promise<Task | {}> => {

  const data = await db.collection("Users").findOneAndUpdate(
    {
      _id: commonUserId,
    },
    {
      $push: { tasks: { ...payload, _id: new ObjectId(), deletion: false } },
    },
    {
      returnDocument: 'after',
      projection: { tasks: 1 }
    }
  );
  if (!data || !data.tasks) {
    throw new ApiError(500,'Failed to create new task');
  }
 const tasks = data.tasks;
  return tasks[tasks.length-1];
};

// used the update decompose method for updating all nested task properties
const update = async (db: Db, payload: any, taskId: string): Promise<Task | {}> => {
  const id = ObjectIdWithErrorHandler(taskId);
  const data = await db.collection("Users").findOneAndUpdate(
    {
      _id: commonUserId,
      "tasks._id": id,
    },
    {
      $set: {
        ...updateCompose("tasks.$", payload),
      },
    },
    {
      returnDocument: 'after',
    }
  );

    if (!data || !data.tasks) {
      throw new ApiError(500,'Failed to update task');
    }
  const tasks = data?.tasks;
  const updatedTask =tasks?.find((ele:Task)=>ele._id.equals(id));
  return updatedTask
};

const remove = async (db: Db, taskId: string) => {
  await db.collection("Users").findOneAndUpdate(
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
  return 'deleted';
};

export default {
  findAll,
  create,
  update,
  remove,
};
