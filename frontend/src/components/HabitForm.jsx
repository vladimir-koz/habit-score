import { useMemo, useState } from "react";

export default function HabitForm({ categoriesInList, onAddHabit }) {
    const [habitNameInput, setHabitNameInput] = useState("");
    const [habitCategoryInput, setHabitCategoryInput] = useState("");
    const [habitPointsInput, setHabitPointsInput] = useState("1");
    const [formError, setFormError] = useState("");

    const categorySuggestionsId = useMemo(
        () => "category-suggestions",
        []
    );

    function handleSubmit(event) {
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

        onAddHabit({
            name: trimmedName,
            category: trimmedCategory,
            points: pointsNumber,
        });

        setHabitNameInput("");
        setHabitCategoryInput("");
        setHabitPointsInput("1");
    }

    return (
        <section className="card">
            <h2 className="sectionTitle">Add habit</h2>

            <form onSubmit={handleSubmit} className="form">
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
                list={categorySuggestionsId}
                />
                <datalist id={categorySuggestionsId}>
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
    );
}
