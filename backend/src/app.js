import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import habitsRouter from "./routes/habits.routes.js";
import fs from "node:fs";

const app = express();

/* middleware CORS */
app.use((req, res, next) => {
const origin = req.headers.origin;

const allowedRaw = process.env.CORS_ALLOWED_ORIGINS || "";
const allowedOrigins = allowedRaw
.split(",")
.map((value) => value.trim())
.filter(Boolean);

if (typeof origin === "string" && allowedOrigins.includes(origin)) {
res.setHeader("Access-Control-Allow-Origin", origin);
}

res.setHeader("Vary", "Origin");
res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
res.status(204).end();
return;
}

next();
});

/**

Middleware: parse JSON bodies
*/
app.use(express.json());

/**

Routes (API)
*/
app.use("/api/v1/habits", habitsRouter);

app.get("/api/v1/health", (req, res) => {
res.status(200).json({ status: "ok" });
});

/**

Serve frontend build (production-like)

This expects:

repoRoot/frontend/dist to exist
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/src -> backend -> repoRoot -> frontend/dist
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
if (!fs.existsSync(frontendDistPath)) {
    console.warn("WARNING: frontend/dist not found. Run: (cd frontend) npm run build");
    }
// Serve static assets (JS/CSS/images)
app.use(express.static(frontendDistPath));

/**

SPA fallback:

If the request is not for /api, return index.html
/
app.get("", (req, res) => {
if (req.path.startsWith("/api/")) {
res.status(404).json({ errorCode: "NOT_FOUND", message: "Route not found" });
return;
}

res.sendFile(path.join(frontendDistPath, "index.html"));
});
*/
export default app;