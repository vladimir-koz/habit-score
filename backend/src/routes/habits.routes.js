import { Router } from "express";
import { getHabitsController } from "../controllers/habits.controller.js";

const router = Router();

/**
 * GET /api/v1/habits
 */
router.get("/", getHabitsController);

export default router;
