import {
    createHabit,
    getAllHabits,
    toggleHabitDoneToday,
} from "../services/habits.service.js";

import { createErrorDTO, validateCreateHabitDTO } from "../dtos/habits.dto.js";

/**
 * Controller: HTTP in / HTTP out
 */

export function getHabitsController(req, res) {
    const habits = getAllHabits();
    res.status(200).json(habits);
}

export function createHabitController(req, res) {
    const validationResult = validateCreateHabitDTO(req.body);

    if (!validationResult.ok) {
        res.status(400).json(validationResult.error);
        return;
    }

    const createdHabit = createHabit(validationResult.value);
    res.status(201).json(createdHabit);
}

export function toggleHabitDoneTodayController(req, res) {
    const habitId = req.params.habitId;

    if (typeof habitId !== "string" || habitId.trim().length === 0) {
        res.status(400).json(createErrorDTO("VALIDATION_ERROR", "Parameter 'habitId' is required."));
        return;
    }

    const updatedHabit = toggleHabitDoneToday(habitId);

    if (!updatedHabit) {
        res.status(404).json(createErrorDTO("NOT_FOUND", "Habit not found."));
        return;
    }

    res.status(200).json(updatedHabit);
}
