import { Router } from "express";
import {
    createHabitController,
    deleteHabitController,
    getHabitsController,
    toggleHabitDoneTodayController,
} from "../controllers/habits.controller.js";

const router = Router();

router.get("/", getHabitsController);
router.post("/", createHabitController);
router.patch("/:habitId/toggle", toggleHabitDoneTodayController);
router.delete("/:habitId", deleteHabitController);

export default router;
