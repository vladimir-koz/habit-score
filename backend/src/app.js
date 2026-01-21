import express from "express";
import habitsRouter from "./routes/habits.routes.js";

const app = express();

/**
 * CORS (DEV) - no external libraries
 * Allows frontend (Vite) on localhost:5173 to call backend on localhost:3000
 */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
    }

    next();
});

/**
 * Middleware: parse JSON bodies
 */
app.use(express.json());

/**
 * Routes
 */
app.use("/api/v1/habits", habitsRouter);

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

export default app;
