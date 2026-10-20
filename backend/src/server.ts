import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/auth.routes.js";
import routes from "./routes/routes.js";

const app = express();
const port = Number(process.env.PLAYWEB_PORT) || 3000;

if (process.env.SERVE_FRONTEND === "true") {
  app.get("/", (req, res) => res.redirect(`/index/index.html${req.url.slice(1)}`));
  app.use(express.static(fileURLToPath(new URL("../../frontend", import.meta.url)), { index: false, redirect: false }));
}

const allowedOrigins = process.env.FRONTEND_ORIGIN ?.split(",").map((origin) => origin.trim()) || [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === "null" || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
}));


app.use(express.json());
app.use("/api/v1/", routes.router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});