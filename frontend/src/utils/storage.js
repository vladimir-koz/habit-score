const STORAGE_KEY_HABITS = "habit-score.habits.v1";

export function safeReadHabitsFromLocalStorage(){
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY_HABITS);
        if(!raw) return null;
    

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const sanitized  = parsed
        .filter((item)=> item && typeof item == "object")
        .map ((item)=> ({
            id: typeof item.id === "string" ? item.id : `h_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            name: typeof item.name === "string" ? item.name : "Unnamed",
            category: typeof item.category === "string" ? item.category : "General",
            points: Number.isFinite(Number(item.points)) ? Number(item.points) : 0,
            isDoneToday: Boolean(item.isDoneToday),
        }));
    return sanitized;
    } catch (error){
        console.warn("Failed to read habits from localStorage:",error);
        return null;
    }
}
export function safeWriteHabitsToLocalStorage(habits){
    try{
        const raw = JSON.stringify(habits);
        window.localStorage.setItem(STORAGE_KEY_HABITS,raw);
        
    } catch (error){
        console.warn("Failed to write habits to localStorage:",error);
    }
}