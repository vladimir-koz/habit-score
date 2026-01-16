import { useState } from "react";

export default function App() {
  const [habits, setHabits] = useState([
    {
      id: "h1",
      name: "Walk 20 minutes",
      category: "Health",
      points: 2,
      isDoneToday: false,
    },
    {
      id: "h2",
      name: "Read 10 pages",
      category: "Mind",
      points: 1,
      isDoneToday: true,
    },
    {
      id: "h3",
      name: "Late-night sugar",
      category: "Food",
      points: -2,
      isDoneToday: false,
    },
  ]);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>habit-score</h1>
      <p style={styles.subtitle}>
        Minimal habit tracker (dummy data, step 1)
      </p>

      <ul style={styles.list}>
        {habits.map((habit) => (
          <li key={habit.id} style={styles.listItem}>
            <div>
              <strong>{habit.name}</strong>
              <div style={styles.meta}>
                {habit.category} · {habit.points} pts
              </div>
            </div>

            <span
              style={{
                ...styles.badge,
                backgroundColor: habit.isDoneToday ? "#1f7a4d" : "#7a1f1f",
              }}
            >
              {habit.isDoneToday ? "Done" : "Not done"}
            </span>
          </li>
        ))}
      </ul>

      <button
        style={styles.button}
        onClick={() => setHabits((currentHabits) => [...currentHabits])}
      >
        Force re-render (no-op)
      </button>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#0f172a",
    color: "#e5e7eb",
  },
  title: {
    margin: 0,
    fontSize: "28px",
  },
  subtitle: {
    marginBottom: "20px",
    color: "#9ca3af",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginBottom: "20px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    marginBottom: "8px",
    backgroundColor: "#020617",
    borderRadius: "8px",
  },
  meta: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    color: "#fff",
  },
  button: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "transparent",
    color: "#e5e7eb",
    cursor: "pointer",
  },
};
