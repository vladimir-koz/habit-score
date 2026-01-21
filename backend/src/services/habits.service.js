/**
 * Habits Service
 * ----------------
 * Business logic layer.
 * Does NOT know about HTTP.
 */

const habitsStore = [
    { id: "h1", name: "Walk 20 minutes", category: "Health", points: 2, isDoneToday: false },
    { id: "h2", name: "Read 10 pages", category: "Mind", points: 1, isDoneToday: true },
    { id: "h3", name: "Late-night sugar", category: "Food", points: -2, isDoneToday: false },
];

function createId() {
    return `h_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getAllHabits() {
    return habitsStore;
}

export function createHabit(createHabitDTO) {
    const newHabit = {
        id: createId(),
        name: createHabitDTO.name,
        category: createHabitDTO.category,
        points: createHabitDTO.points,
        isDoneToday: false,
    };

    habitsStore.unshift(newHabit);
    return newHabit;
}

export function toggleHabitDoneToday(habitId) {
    const habit = habitsStore.find((h) => h.id === habitId);
    if (!habit) return null;

    habit.isDoneToday = !habit.isDoneToday;
    return habit;
}

/**
 * Delete habit by id.
 * Returns true if deleted, false if not found.
 */
export function deleteHabit(habitId) {
    const index = habitsStore.findIndex((h) => h.id === habitId);
    if (index === -1) return false;

    habitsStore.splice(index, 1);
    return true;
}
