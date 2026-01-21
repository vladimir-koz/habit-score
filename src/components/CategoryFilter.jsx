export default function CategoryFilter({
    selectedCategory,
    categoriesInList,
    visibleCount,
    totalCount,
    onSelectedCategoryChange,
}) {
    return (
        <section className="card">
        <h2 className="sectionTitle">Filter</h2>

        <div className="filterRow">
            <label className="labelInline">
            Category
            <select
                value={selectedCategory}
                onChange={onSelectedCategoryChange}
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
            Showing <strong>{visibleCount}</strong> of <strong>{totalCount}</strong>
            </div>
        </div>
        </section>
);
}
