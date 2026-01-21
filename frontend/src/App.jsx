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
  deleteHabit as apiDeleteHabit,
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
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isLoading, setIsLoading] = useState(true);
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadFromApiAndUpdateState() {
    const apiHabits = await fetchHabits();

    if (Array.isArray(apiHabits) && apiHabits.length > 0) {
      setHabits(apiHabits);
      safeWriteHabitsToLocalStorage(apiHabits);
    } else if (Array.isArray(apiHabits) && apiHabits.length === 0) {
      // Server has no data: keep local (do not wipe local)
      // This avoids accidental deletion of offline data.
    }
  }

  // Initial load: try API, fallback to localStorage, fallback to defaults
  useEffect(() => {
    let isCancelled = false;

    async function loadInitialHabits() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        await loadFromApiAndUpdateState();
        if (isCancelled) return;
        setIsApiAvailable(true);
      } catch (error) {
        if (isCancelled) return;

        setIsApiAvailable(false);
        setErrorMessage("Backend API not available. Using offline data (localStorage).");

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

  // Always persist locally after initial load attempt
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

  // Manual sync button
  async function handleTrySync() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      await loadFromApiAndUpdateState();
      setIsApiAvailable(true);
      setErrorMessage("");
    } catch (error) {
      setIsApiAvailable(false);
      setErrorMessage("Sync failed. Backend still not available. Staying offline.");
    } finally {
      setIsLoading(false);
    }
  }

  // OFFLINE-FIRST: optimistic UI + best-effort sync
  async function handleAddHabit({ name, category, points }) {
    setErrorMessage("");

    const tempId = createTempId();
    const tempHabit = { id: tempId, name, category, points, isDoneToday: false };

    setHabits((current) => [tempHabit, ...current]);

    if (!isApiAvailable) return;

    try {
      const createdHabit = await apiCreateHabit({ name, category, points });
      setHabits((current) => current.map((h) => (h.id === tempId ? createdHabit : h)));
    } catch (error) {
      setIsApiAvailable(false);
      setErrorMessage("Failed to sync with backend. Staying offline.");
    }
  }

  async function handleToggleDoneToday(habitId) {
    setErrorMessage("");

    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== habitId) return habit;
        return { ...habit, isDoneToday: !habit.isDoneToday };
      })
    );

    if (!isApiAvailable || isTempId(habitId)) return;

    try {
      const updatedHabit = await apiToggleHabitDoneToday(habitId);
      setHabits((current) => current.map((h) => (h.id === habitId ? updatedHabit : h)));
    } catch (error) {
      setIsApiAvailable(false);
      setErrorMessage("Failed to sync toggle with backend. Staying offline.");
    }
  }

  async function handleDeleteHabit(habitId) {
    setErrorMessage("");

    // remove locally first (offline-first)
    setHabits((current) => current.filter((h) => h.id !== habitId));

    // if offline or temp -> done
    if (!isApiAvailable || isTempId(habitId)) return;

    try {
      await apiDeleteHabit(habitId);
    } catch (error) {
      setIsApiAvailable(false);
      setErrorMessage("Failed to sync delete with backend. Staying offline.");
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

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
          <button
            type="button"
            className="primaryButton"
            onClick={handleTrySync}
            disabled={isLoading}
            title="Try to fetch from backend and switch to online mode"
          >
            Try to sync
          </button>
        </div>

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

        <HabitList
          habits={visibleHabits}
          onToggleDoneToday={handleToggleDoneToday}
          onDeleteHabit={handleDeleteHabit}
        />
      </main>

      <footer className="footer">
        <small className="muted">
          Offline-first. Use “Try to sync” to switch back to online when backend is available.
        </small>
      </footer>
    </div>
  );
}
