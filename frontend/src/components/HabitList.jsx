export default function HabitList({ habits, onToggleDoneToday, onDeleteHabit }) {
    return (
        <section className="card">
        <h2 className="sectionTitle">Habits</h2>

        {habits.length === 0 ? (
            <p className="muted">No habits in this category.</p>
        ) : (
            <ul className="list">
            {habits.map((habit) => (
                <li key={habit.id} className="listItem">
                <div className="habitRow">
                    <div className="habitLeft">
                    <span className="habitName">{habit.name}</span>
                    <span className="habitMeta">
                        {habit.category} · {habit.points} pts
                    </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                        type="button"
                        onClick={() => onToggleDoneToday(habit.id)}
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

                    <button
                        type="button"
                        onClick={() => onDeleteHabit(habit.id)}
                        className="toggleButton"
                        title="Delete habit"
                        aria-label={`Delete ${habit.name}`}
                    >
                        Delete
                    </button>
                    </div>
                </div>
                </li>
            ))}
            </ul>
        )}
        </section>
    );
}
