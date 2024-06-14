import express from "express";
import { create, findAll, remove, update } from "./task_controller";
import subTasks_route from './subTasks/subTasks_route'
const router = express.Router();
router.use('/:taskId/subTasks',subTasks_route);
router.get('/',findAll)
router.post('/',create)
router.put('/:taskId', update)
router.delete('/remove/:taskId', remove)
export default router;