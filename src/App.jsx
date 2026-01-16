import { useMemo, useState } from "react";

export default function App() {
  const [habits, setHabits] = useState([
    { id: "h1", name: "Walk 20 minutes", category: "Health", points: 2, isDoneToday: false },
    { id: "h2", name: "Read 10 pages", category: "Mind", points: 1, isDoneToday: true },
    { id: "h3", name: "Late-night sugar", category: "Food", points: -2, isDoneToday: false },
  ]);

  const [habitNameInput, setHabitNameInput] = useState("");
  const [habitCategoryInput, setHabitCategoryInput] = useState("");
  const [habitPointsInput, setHabitPointsInput] = useState("1");
  const [formError, setFormError] = useState("");

  const categoriesInList = useMemo(() => {
    const unique = new Set(habits.map((h) => h.category).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [habits]);

  function createId() {
    // Simple id for local state (good enough for this project)
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

    // Reset inputs
    setHabitNameInput("");
    setHabitCategoryInput("");
    setHabitPointsInput("1");
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>habit-score</h1>
        <p style={styles.subtitle}>Add habits and track points for today (step 2)</p>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Add habit</h2>

          <form onSubmit={handleAddHabitSubmit} style={styles.form}>
            <label style={styles.label}>
              Name
              <input
                value={habitNameInput}
                onChange={(e) => setHabitNameInput(e.target.value)}
                placeholder="e.g. Drink water"
                style={styles.input}
                autoComplete="off"
              />
            </label>

            <label style={styles.label}>
              Category
              <input
                value={habitCategoryInput}
                onChange={(e) => setHabitCategoryInput(e.target.value)}
                placeholder="e.g. Health"
                style={styles.input}
                autoComplete="off"
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {categoriesInList.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </label>

            <label style={styles.label}>
              Points (can be negative)
              <input
                value={habitPointsInput}
                onChange={(e) => setHabitPointsInput(e.target.value)}
                placeholder="e.g. 2 or -1"
                style={styles.input}
                inputMode="numeric"
              />
            </label>

            <div style={styles.formActions}>
              <button type="submit" style={styles.primaryButton}>
                Add habit
              </button>
            </div>

            {formError ? <p style={styles.error}>{formError}</p> : null}
          </form>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Habits</h2>

          {habits.length === 0 ? (
            <p style={styles.muted}>No habits yet.</p>
          ) : (
            <ul style={styles.list}>
              {habits.map((habit) => (
                <li key={habit.id} style={styles.listItem}>
                  <div style={styles.habitRow}>
                    <div style={styles.habitLeft}>
                      <span style={styles.habitName}>{habit.name}</span>
                      <span style={styles.habitMeta}>
                        {habit.category} · {habit.points} pts
                      </span>
                    </div>

                    <span
                      style={{
                        ...styles.badge,
                        ...(habit.isDoneToday ? styles.badgeDone : styles.badgeNotDone),
                      }}
                    >
                      {habit.isDoneToday ? "Done" : "Not done"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer style={styles.footer}>
        <small style={styles.muted}>Next: toggle done today + daily score.</small>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "16px",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    background: "#0b0f17",
    color: "#e6e6e6",
  },
  header: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "12px 0 6px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    letterSpacing: "0.3px",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#a8b3cf",
    fontSize: "14px",
  },
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    paddingTop: "12px",
    display: "grid",
    gap: "12px",
  },
  card: {
    background: "#121a2a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "16px",
  },
  sectionTitle: {
    margin: "0 0 12px",
    fontSize: "16px",
    color: "#d9e2ff",
  },
  muted: {
    color: "#a8b3cf",
  },
  form: {
    display: "grid",
    gap: "10px",
  },
  label: {
    display: "grid",
    gap: "6px",
    fontSize: "13px",
    color: "#c7d2fe",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.04)",
    color: "#e6e6e6",
    outline: "none",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "6px",
  },
  primaryButton: {
    background: "rgba(99,102,241,0.9)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    borderRadius: "10px",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 600,
  },
  error: {
    margin: "6px 0 0",
    color: "#ffd0d0",
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.25)",
    padding: "10px 12px",
    borderRadius: "10px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: "10px",
  },
  listItem: {
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  habitRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
  },
  habitLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },
  habitName: {
    fontWeight: 600,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  habitMeta: {
    fontSize: "13px",
    color: "#a8b3cf",
  },
  badge: {
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.10)",
    flexShrink: 0,
  },
  badgeDone: {
    background: "rgba(34,197,94,0.18)",
    color: "#bff7d0",
  },
  badgeNotDone: {
    background: "rgba(239,68,68,0.14)",
    color: "#ffd0d0",
  },
  footer: {
    maxWidth: "900px",
    margin: "0 auto",
    paddingTop: "16px",
  },
};
