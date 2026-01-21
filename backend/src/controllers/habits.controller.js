import { getAllHabits } from "../services/habits.service.js";

/**
 * Controller: HTTP in / HTTP out
 * Receives request, calls service, returns response.
 */

export function getHabitsController(req, res) {
    const habits = getAllHabits();

    res.status(200).json(habits);
}
