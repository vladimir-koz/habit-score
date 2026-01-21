export default function ScoreBar({ dailyScore }) {
    const scorePillClassName =
        dailyScore >= 0 ? "pill pillPositive" : "pill pillNegative";

    return (
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
    );
}
