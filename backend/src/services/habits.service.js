/**
 * Habits Service
 * ----------------
 * This layer contains business logic.
 * It does NOT know anything about HTTP or Express.
 */

const hardcodedHabits = [
    { id: "h1", name: "Walk 20 minutes", category: "Health", points: 2, isDoneToday: false },
    { id: "h2", name: "Read 10 pages", category: "Mind", points: 1, isDoneToday: true },
    { id: "h3", name: "Late-night sugar", category: "Food", points: -2, isDoneToday: false },
];

/**
   * Returns the list of habits.
   * In the future this will query the database.
*/
export function getAllHabits() {
    return hardcodedHabits;
}
