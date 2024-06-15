import express from "express";
import { create, findAll, remove, update } from "./task_controller";
import subTasks_route from './subTasks/subTasks_route'
import { createTaskValidation, updateTaskValidation } from "./task_validation";
import schemaValidation from "../../ajv/validator";
const router = express.Router();
// added schema validation with ajv wherever we got any payload.
router.use('/:taskId/subTasks',subTasks_route);
router.get('/',findAll)
router.post('/',schemaValidation(createTaskValidation),create)
router.put('/:taskId',schemaValidation(updateTaskValidation), update)
router.delete('/:taskId', remove)
export default router;