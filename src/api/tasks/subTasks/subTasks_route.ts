import express from "express";
import { create, findAll, remove, update } from "./subTasks_controller";
const router = express.Router({ mergeParams: true });

router.get('/',findAll)
router.post('/',create)
router.put('/:subTaskId', update)
router.delete('/remove/:subTaskId', remove)
export default router;