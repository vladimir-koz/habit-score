import { createHabit, getAllHabits } from "../services/habits.service.js";
import { validateCreateHabitDTO } from "../dtos/habits.dto.js";

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
