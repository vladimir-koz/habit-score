import { prisma } from "../db/prisma.js";

export async function getAllHabits() {
    return prisma.habit.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function createHabit(createHabitDTO) {
    return prisma.habit.create({
        data: {
        name: createHabitDTO.name,
        category: createHabitDTO.category,
        points: Math.trunc(createHabitDTO.points),
        isDoneToday: false,
        },
    });
}

export async function toggleHabitDoneToday(habitId) {
    const existing = await prisma.habit.findUnique({
        where: { id: habitId },
    });

    if (!existing) return null;

    return prisma.habit.update({
        where: { id: habitId },
        data: { isDoneToday: !existing.isDoneToday },
    });
}

export async function deleteHabit(habitId) {
    try {
        await prisma.habit.delete({
        where: { id: habitId },
        });
        return true;
    } catch {
        return false;
    }
}
