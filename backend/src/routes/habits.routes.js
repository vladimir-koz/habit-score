import { Router } from "express";
import {
    createHabitController,
    getHabitsController,
    toggleHabitDoneTodayController,
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

/**
 * PATCH /api/v1/habits/:habitId/toggle
 */
router.patch("/:habitId/toggle", toggleHabitDoneTodayController);

export default router;
