import { ObjectId } from "mongodb";

export interface Task {
    _id: ObjectId;
    subject: string;
    deadline: string;
    status: string;
    subTasks?: SubTask[];
    deletion?: boolean;
  }
  
  export interface SubTask {
    _id: ObjectId;
    subject: string;
    deadline: string;
    status: string;
    deletion?: boolean;
  }

  export interface User {
    _id: ObjectId;
    name: string;
    email: string;
    tasks?: Task[];
  }


  