import { Db, ObjectId, ReturnDocument } from "mongodb";
import { ObjectIdWithErrorHandler, asyncForEach, updateCompose } from "../../../helper";
import { SubTask, Task, User } from "../../../interfaces/common.interface";
import ApiError from "../../../utils/ApiError";

const commonUserId = ObjectIdWithErrorHandler("666c19dc4a86eedd7b998fea");
// $match -> user id and task id and unwind it
// $unwind -> destructure all subTasks too 
// $match -> filter out subtasks with deletion set true 
//$replaceRoot -> to give the required subtasks
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
      returnDocument: "after"
    }
  );
  return data;
};

// used async forEach method to update all matching sub tasks.
// extra check if any subtask is set deletion true 
const update = async (
  db: Db,
  payload: any,
  taskId: string,
) => {
    let data: any;
    let ids:string[] = []
   await asyncForEach(payload.subTasks, async (_subTask:any)=> {
    const id = _subTask._id;
    ids.push(id);
    delete _subTask?._id;
    if(_subTask?.deletion) throw new ApiError(500,'This is subtask is already deleted');
    data = await db.collection("Users").findOneAndUpdate(
        {
          _id: commonUserId,
          "tasks._id": ObjectIdWithErrorHandler(taskId),
        },
        {
          $set: {
            ...updateCompose("tasks.$[elem].subTasks.$[subElem]", _subTask),
          },
        },
        {
          arrayFilters: [
            { "elem._id": ObjectIdWithErrorHandler(taskId) },
            { "subElem._id": ObjectIdWithErrorHandler(id) },
          ],
          returnDocument: "after",
        },
      );
      if(!data) throw new ApiError(500, 'Failed to update the subtask');
   })
   const tasks = data?.tasks;
   const updatedTask =tasks?.find((ele:Task)=>ele._id.equals(taskId));

   return updatedTask?.subTasks?.filter((ele:SubTask)=> ids.includes(ele._id.toString())) ?? []; 
};

const remove = async (db: Db, taskId: string, subTaskId: string) => {
  await db.collection("Users").findOneAndUpdate(
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
  return 'deleted';
};

export default {
  findAll,
  create,
  update,
  remove,
};
