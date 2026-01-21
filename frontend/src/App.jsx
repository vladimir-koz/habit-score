import { useEffect, useMemo, useState } from "react";
import "./App.css";

import ScoreBar from "./components/ScoreBar";
import CategoryFilter from "./components/CategoryFilter";
import HabitForm from "./components/HabitForm";
import HabitList from "./components/HabitList";

import {
  safeReadHabitsFromLocalStorage,
  safeWriteHabitsToLocalStorage,
} from "./utils/storage";

const DEFAULT_HABITS = [
  { id: "h1", name: "Walk 20 minutes", category: "Health", points: 2, isDoneToday: false },
  { id: "h2", name: "Read 10 pages", category: "Mind", points: 1, isDoneToday: true },
  { id: "h3", name: "Late-night sugar", category: "Food", points: -2, isDoneToday: false },
];

export default function App() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);

  // prevents initial overwrite in dev StrictMode
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load once
  useEffect(() => {
    const storedHabits = safeReadHabitsFromLocalStorage();
    if (storedHabits && storedHabits.length > 0) {
      setHabits(storedHabits);
    }
    setHasLoadedFromStorage(true);
  }, []);

  // Save on change (only after load attempt)
  useEffect(() => {
    if (!hasLoadedFromStorage) return;
    safeWriteHabitsToLocalStorage(habits);
  }, [habits, hasLoadedFromStorage]);

  const categoriesInList = useMemo(() => {
    const unique = new Set(habits.map((h) => h.category).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [habits]);

  const visibleHabits = useMemo(() => {
    if (selectedCategory === "All") return habits;
    return habits.filter((habit) => habit.category === selectedCategory);
  }, [habits, selectedCategory]);

  const dailyScore = useMemo(() => {
    return habits.reduce((total, habit) => {
      if (!habit.isDoneToday) return total;
      return total + habit.points;
    }, 0);
  }, [habits]);

  function createId() {
    return `h_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function handleAddHabit({ name, category, points }) {
    const newHabit = {
      id: createId(),
      name,
      category,
      points,
      isDoneToday: false,
    };

    setHabits((currentHabits) => [newHabit, ...currentHabits]);
  }

  function handleToggleDoneToday(habitId) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) return habit;
        return { ...habit, isDoneToday: !habit.isDoneToday };
      })
    );
  }

  function handleSelectedCategoryChange(event) {
    setSelectedCategory(event.target.value);
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">habit-score</h1>
        <p className="subtitle">Refactor into components (commit 8)</p>
      </header>

      <main className="main">
        <ScoreBar dailyScore={dailyScore} />

        <CategoryFilter
          selectedCategory={selectedCategory}
          categoriesInList={categoriesInList}
          visibleCount={visibleHabits.length}
          totalCount={habits.length}
          onSelectedCategoryChange={handleSelectedCategoryChange}
        />

        <HabitForm categoriesInList={categoriesInList} onAddHabit={handleAddHabit} />

        <HabitList habits={visibleHabits} onToggleDoneToday={handleToggleDoneToday} />
      </main>

      <footer className="footer">
        <small className="muted">Next: small cleanup + README.</small>
      </footer>
    </div>
  );
}
