import express from "express";
import { create, findAll, remove, update } from "./subTasks_controller";
import schemaValidation from "../../../ajv/validator";
import { createSubTaskValidation, updateSubTaskValidation } from "./subTasks_validation";
const router = express.Router({ mergeParams: true });

router.get('/',findAll)
router.post('/', schemaValidation(createSubTaskValidation),create)
router.put('/',schemaValidation(updateSubTaskValidation), update)
router.delete('/remove/:subTaskId', remove)
export default router;