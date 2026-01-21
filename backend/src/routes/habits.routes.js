import { Router } from "express";
import {
    createHabitController,
    getHabitsController,
} from "../controllers/habits.controller.js";

const router = Router();

/**
 * GET /api/v1/habits
 */
router.get("/", getHabitsController);

/**
 * POST /api/v1/habits
 */
router.post("/", createHabitController);

export default router;
