import { Router } from "express";
import task_Route from './api/tasks/task_route';
const router = Router();

router.use('/tasks', task_Route);
export default router;