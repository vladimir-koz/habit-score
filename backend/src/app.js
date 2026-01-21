import express from "express";
import habitsRouter from "./routes/habits.routes.js";

const app = express();

/**
 * Middleware: parse JSON bodies
 * Permite que Express lea req.body cuando mandes JSON desde el frontend.
 */
app.use(express.json());

/**
 * Route mounting:
 * Todo lo que empiece con /api/v1/habits se resuelve en habitsRouter.
 */
app.use("/api/v1/habits", habitsRouter);

/**
 * Health check simple (opcional pero útil)
 */
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

export default app;
