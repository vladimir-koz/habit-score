import {
    getAllHabits,
    createHabit,
    toggleHabitDoneToday,
    deleteHabit,
} from "../services/habits.service.js";

import { createErrorDTO, validateCreateHabitDTO } from "../dtos/habits.dto.js";

export async function getHabitsController(req, res) {
    const habits = await getAllHabits();
    res.status(200).json(habits);
}

export async function createHabitController(req, res) {
const validationResult = validateCreateHabitDTO(req.body);

if (!validationResult.ok) {
    res.status(400).json(validationResult.error);
    return;
}

const habit = await createHabit(validationResult.value);
res.status(201).json(habit);
}

export async function toggleHabitDoneTodayController(req, res) {
const habitId = req.params.habitId;

if (!habitId) {
    res.status(400).json(createErrorDTO("VALIDATION_ERROR", "habitId is required"));
    return;
}

const habit = await toggleHabitDoneToday(habitId);

if (!habit) {
    res.status(404).json(createErrorDTO("NOT_FOUND", "Habit not found"));
    return;
}

res.status(200).json(habit);
}

export async function deleteHabitController(req, res) {
    const habitId = req.params.habitId;

    if (!habitId) {
        res.status(400).json(createErrorDTO("VALIDATION_ERROR", "habitId is required"));
        return;
    }

    const deleted = await deleteHabit(habitId);

    if (!deleted) {
        res.status(404).json(createErrorDTO("NOT_FOUND", "Habit not found"));
        return;
    }

    res.status(204).end();
}
