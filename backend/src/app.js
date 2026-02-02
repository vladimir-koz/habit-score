import express from "express";
import habitsRouter from "./routes/habits.routes.js";

const app = express();

/* middleware CORS  */
app.use((req, res, next) => {
    const origin = req.headers.origin;

    const allowedRaw= process.env.CORS_ALLOWED_ORIGINS || "";
    const allowedOrigins=allowedRaw
    .split(",")
    .map((value)=> value.trim())
    .filter(Boolean);

    if(typeof origin== "string" && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin",origin);
    }

    res.setHeader("Vary","Origin");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if(req.method === "OPTIONS"){
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
