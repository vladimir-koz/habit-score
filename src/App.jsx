import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY_HABITS = "habit-score.habits.v1";

const DEFAULT_HABITS = [
  { id: "h1", name: "Walk 20 minutes", category: "Health", points: 2, isDoneToday: false },
  { id: "h2", name: "Read 10 pages", category: "Mind", points: 1, isDoneToday: true },
  { id: "h3", name: "Late-night sugar", category: "Food", points: -2, isDoneToday: false },
];

function safeReadHabitsFromLocalStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_HABITS);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const sanitized = parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : `h_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        name: typeof item.name === "string" ? item.name : "Unnamed",
        category: typeof item.category === "string" ? item.category : "General",
        points: Number.isFinite(Number(item.points)) ? Number(item.points) : 0,
        isDoneToday: Boolean(item.isDoneToday),
      }));

    return sanitized;
  } catch (error) {
    console.warn("Failed to read habits from localStorage:", error);
    return null;
  }
}

function safeWriteHabitsToLocalStorage(habits) {
  try {
    const raw = JSON.stringify(habits);
    window.localStorage.setItem(STORAGE_KEY_HABITS, raw);
  } catch (error) {
    console.warn("Failed to write habits to localStorage:", error);
  }
}

export default function App() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  const [habitNameInput, setHabitNameInput] = useState("");
  const [habitCategoryInput, setHabitCategoryInput] = useState("");
  const [habitPointsInput, setHabitPointsInput] = useState("1");
  const [formError, setFormError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const storedHabits = safeReadHabitsFromLocalStorage();
    if (storedHabits && storedHabits.length > 0) {
      setHabits(storedHabits);
    }
    setHasLoadedFromStorage(true);
  }, []);

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

  function handleAddHabitSubmit(event) {
    event.preventDefault();
    setFormError("");

    const trimmedName = habitNameInput.trim();
    const trimmedCategory = habitCategoryInput.trim();
    const pointsNumber = Number(habitPointsInput);

    if (!trimmedName) {
      setFormError("Name is required.");
      return;
    }
    if (!trimmedCategory) {
      setFormError("Category is required.");
      return;
    }
    if (!Number.isFinite(pointsNumber)) {
      setFormError("Points must be a valid number (can be negative).");
      return;
    }

    const newHabit = {
      id: createId(),
      name: trimmedName,
      category: trimmedCategory,
      points: pointsNumber,
      isDoneToday: false,
    };

    setHabits((currentHabits) => [newHabit, ...currentHabits]);

    setHabitNameInput("");
    setHabitCategoryInput("");
    setHabitPointsInput("1");
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

  const scorePillClassName =
    dailyScore >= 0 ? "pill pillPositive" : "pill pillNegative";

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">habit-score</h1>
        <p className="subtitle">CSS file styling + responsive basics (commit 7)</p>
      </header>

      <main className="main">
        <section className="card">
          <h2 className="sectionTitle">Today</h2>

          <div className="scoreRow">
            <div>
              <div className="scoreLabel">Daily score</div>
              <div className="scoreValue">{dailyScore}</div>
            </div>

            <div className={scorePillClassName}>
              {dailyScore >= 0 ? "Positive" : "Negative"}
            </div>
          </div>

          <p className="mutedSmall">Score is derived from all habits marked as done today.</p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Filter</h2>

          <div className="filterRow">
            <label className="labelInline">
              Category
              <select
                value={selectedCategory}
                onChange={handleSelectedCategoryChange}
                className="select"
              >
                <option value="All">All</option>
                {categoriesInList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <div className="muted">
              Showing <strong>{visibleHabits.length}</strong> of{" "}
              <strong>{habits.length}</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Add habit</h2>

          <form onSubmit={handleAddHabitSubmit} className="form">
            <label className="label">
              Name
              <input
                value={habitNameInput}
                onChange={(e) => setHabitNameInput(e.target.value)}
                placeholder="e.g. Drink water"
                className="input"
                autoComplete="off"
              />
            </label>

            <label className="label">
              Category
              <input
                value={habitCategoryInput}
                onChange={(e) => setHabitCategoryInput(e.target.value)}
                placeholder="e.g. Health"
                className="input"
                autoComplete="off"
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {categoriesInList.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </label>

            <label className="label">
              Points (can be negative)
              <input
                value={habitPointsInput}
                onChange={(e) => setHabitPointsInput(e.target.value)}
                placeholder="e.g. 2 or -1"
                className="input"
                inputMode="numeric"
              />
            </label>

            <div className="formActions">
              <button type="submit" className="primaryButton">
                Add habit
              </button>
            </div>

            {formError ? <p className="error">{formError}</p> : null}
          </form>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Habits</h2>

          {visibleHabits.length === 0 ? (
            <p className="muted">No habits in this category.</p>
          ) : (
            <ul className="list">
              {visibleHabits.map((habit) => (
                <li key={habit.id} className="listItem">
                  <div className="habitRow">
                    <div className="habitLeft">
                      <span className="habitName">{habit.name}</span>
                      <span className="habitMeta">
                        {habit.category} · {habit.points} pts
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleDoneToday(habit.id)}
                      className={
                        habit.isDoneToday
                          ? "toggleButton toggleOn"
                          : "toggleButton toggleOff"
                      }
                      aria-pressed={habit.isDoneToday}
                      title="Toggle done today"
                    >
                      {habit.isDoneToday ? "Done" : "Not done"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="footer">
        <small className="muted">Next: refactor into components (Form, List, ScoreBar, Filter).</small>
      </footer>
    </div>
  );
}
