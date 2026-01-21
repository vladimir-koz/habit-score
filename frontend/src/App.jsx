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

import {
  fetchHabits,
  createHabit as apiCreateHabit,
  toggleHabitDoneToday as apiToggleHabitDoneToday,
} from "./utils/api";

const DEFAULT_HABITS = [
  { id: "h1", name: "Walk 20 minutes", category: "Health", points: 2, isDoneToday: false },
  { id: "h2", name: "Read 10 pages", category: "Mind", points: 1, isDoneToday: true },
  { id: "h3", name: "Late-night sugar", category: "Food", points: -2, isDoneToday: false },
];

function createTempId() {
  return `temp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isTempId(id) {
  return typeof id === "string" && id.startsWith("temp_");
}

export default function App() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);

  // Prevents initial overwrite in dev StrictMode + helps for offline-first loading
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");

  // Integration states
  const [isLoading, setIsLoading] = useState(true);
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 1) Initial load: try API, fallback to localStorage, fallback to defaults
  useEffect(() => {
    let isCancelled = false;

    async function loadInitialHabits() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const apiHabits = await fetchHabits();
        if (isCancelled) return;

        if (Array.isArray(apiHabits) && apiHabits.length > 0) {
          setHabits(apiHabits);
          // keep offline copy updated
          safeWriteHabitsToLocalStorage(apiHabits);
        }

        setIsApiAvailable(true);
      } catch (error) {
        if (isCancelled) return;

        // API failed -> offline fallback
        setIsApiAvailable(false);
        setErrorMessage(
          `Backend API not available. Using offline data (localStorage).`
        );

        const storedHabits = safeReadHabitsFromLocalStorage();
        if (storedHabits && storedHabits.length > 0) {
          setHabits(storedHabits);
        } else {
          setHabits(DEFAULT_HABITS);
        }
      } finally {
        if (isCancelled) return;
        setHasLoadedInitialData(true);
        setIsLoading(false);
      }
    }

    loadInitialHabits();

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2) Always persist locally after initial load attempt
  useEffect(() => {
    if (!hasLoadedInitialData) return;
    safeWriteHabitsToLocalStorage(habits);
  }, [habits, hasLoadedInitialData]);

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

  function handleSelectedCategoryChange(event) {
    setSelectedCategory(event.target.value);
  }

  // OFFLINE-FIRST: optimistic UI + best-effort sync
  async function handleAddHabit({ name, category, points }) {
    setErrorMessage("");

    const tempId = createTempId();
    const tempHabit = {
      id: tempId,
      name,
      category,
      points,
      isDoneToday: false,
    };

    // optimistic: show instantly
    setHabits((current) => [tempHabit, ...current]);

    if (!isApiAvailable) return;

    try {
      const createdHabit = await apiCreateHabit({ name, category, points });

      // replace temp habit with server habit
      setHabits((current) =>
        current.map((h) => (h.id === tempId ? createdHabit : h))
      );
    } catch (error) {
      // keep offline habit, mark API unavailable for now
      setIsApiAvailable(false);
      setErrorMessage(`Failed to sync with backend. Staying offline.`);
    }
  }

  async function handleToggleDoneToday(habitId) {
    setErrorMessage("");

    // optimistic toggle
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== habitId) return habit;
        return { ...habit, isDoneToday: !habit.isDoneToday };
      })
    );

    // temp habits cannot be toggled on server (they do not exist there)
    if (!isApiAvailable || isTempId(habitId)) return;

    try {
      const updatedHabit = await apiToggleHabitDoneToday(habitId);

      // ensure client state matches server
      setHabits((current) =>
        current.map((h) => (h.id === habitId ? updatedHabit : h))
      );
    } catch (error) {
      // stay offline, keep optimistic result
      setIsApiAvailable(false);
      setErrorMessage(`Failed to sync toggle with backend. Staying offline.`);
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">habit-score</h1>
        <p className="subtitle">
          {isLoading
            ? "Loading..."
            : isApiAvailable
            ? "Online mode (API + localStorage backup)"
            : "Offline mode (localStorage)"}
        </p>

        {errorMessage ? (
          <p className="error" style={{ marginTop: "10px" }}>
            {errorMessage}
          </p>
        ) : null}
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
        <small className="muted">
          Offline-first: UI works without backend. When backend is available, it syncs best-effort.
        </small>
      </footer>
    </div>
  );
}
