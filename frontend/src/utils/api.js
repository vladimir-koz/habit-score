const API_BASE_URL = "http://localhost:3000/api/v1";

async function parseJsonResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return response.json();
    }
    return null;
}

export async function fetchHabits() {
    const response = await fetch(`${API_BASE_URL}/habits`, { method: "GET" });

    if (!response.ok) {
        const body = await parseJsonResponse(response);
        const message = body?.message || `Failed to fetch habits (status ${response.status}).`;
        throw new Error(message);
    }

    return parseJsonResponse(response);
}

export async function createHabit(createHabitDTO) {
    const response = await fetch(`${API_BASE_URL}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createHabitDTO),
    });

    if (!response.ok) {
        const body = await parseJsonResponse(response);
        const message = body?.message || `Failed to create habit (status ${response.status}).`;
        throw new Error(message);
    }

    return parseJsonResponse(response);
}

export async function toggleHabitDoneToday(habitId) {
    const response = await fetch(`${API_BASE_URL}/habits/${habitId}/toggle`, {
    method: "PATCH",
    });

    if (!response.ok) {
        const body = await parseJsonResponse(response);
        const message = body?.message || `Failed to toggle habit (status ${response.status}).`;
        throw new Error(message);
    }

    return parseJsonResponse(response);
}

export async function deleteHabit(habitId) {
    const response = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
    method: "DELETE",
    });

    if (response.status === 204) return;

    if (!response.ok) {
        const body = await parseJsonResponse(response);
        const message = body?.message || `Failed to delete habit (status ${response.status}).`;
        throw new Error(message);
    }
}
