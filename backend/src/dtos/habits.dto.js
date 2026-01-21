/**
 * DTO validation (manual, no external libraries)
 * ----------------------------------------------
 * This file validates incoming data and returns:
 * - { ok: true, value: normalizedDto }
 * - { ok: false, error: ErrorDTO }
 */

function createErrorDTO(errorCode, message) {
    return { errorCode, message };
}

export function validateCreateHabitDTO(input) {
    if (!input || typeof input !== "object") {
        return {
        ok: false,
        error: createErrorDTO("VALIDATION_ERROR", "Request body must be a JSON object."),
        };
    }

    const rawName = input.name;
    const rawCategory = input.category;
    const rawPoints = input.points;

    if (typeof rawName !== "string") {
        return {
        ok: false,
        error: createErrorDTO("VALIDATION_ERROR", "Field 'name' must be a string."),
        };
    }

    if (typeof rawCategory !== "string") {
        return {
        ok: false,
        error: createErrorDTO("VALIDATION_ERROR", "Field 'category' must be a string."),
        };
    }

    const name = rawName.trim();
    const category = rawCategory.trim();

    if (name.length === 0) {
        return {
        ok: false,
        error: createErrorDTO("VALIDATION_ERROR", "Field 'name' is required."),
        };
    }

    if (category.length === 0) {
        return {
        ok: false,
        error: createErrorDTO("VALIDATION_ERROR", "Field 'category' is required."),
        };
    }

    const pointsNumber = Number(rawPoints);
    if (!Number.isFinite(pointsNumber)) {
        return {
        ok: false,
        error: createErrorDTO(
            "VALIDATION_ERROR",
            "Field 'points' must be a valid number (can be negative)."
        ),
        };
    }

    return {
        ok: true,
        value: {
        name,
        category,
        points: pointsNumber,
        },
    };
}
