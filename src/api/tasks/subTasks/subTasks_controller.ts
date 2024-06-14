import { Request, Response, NextFunction } from "express"
import service from "./subTasks_service"

export const findAll = async (req: Request, res: Response, next: NextFunction)=> {
    const {db} = req.app.locals;
    const taskId = req.params.taskId;
   try {
    const data = await service.findAll(db, taskId);
    res.status(200).send({status: 200, data: data, message: "Fetched records successfully"});
   }catch(e){
    next(e);
   }
}

export const create = async (req: Request, res: Response, next: NextFunction)=> {
    const {db} = req.app.locals;
    const taskId = req.params.taskId;
   try {
    const data = await service.create(db, req.body, taskId);
    res.status(200).send({status: 200, data: data, message: "Created record successfully"});
   }catch(e){
    next(e);
   }
}

export const update = async (req: Request, res: Response, next: NextFunction)=> {
    const {db} = req.app.locals;
    const {taskId, subTaskId }= req.params
   try {
    const data = await service.update(db, req.body, taskId, subTaskId);
    res.status(200).send({status: 200, data: data, message: "Updated record successfully"});
   }catch(e){
    next(e);
   }
}

export const remove = async (req: Request, res: Response, next: NextFunction)=> {
    const {db} = req.app.locals;
    const {taskId, subTaskId }= req.params
   try {
    const data = await service.remove(db, taskId, subTaskId);
    res.status(200).send({status: 200, data: data, message: "Deleted record successfully"});
   }catch(e){
    next(e);
   }
}