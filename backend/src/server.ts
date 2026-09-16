import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import routes from "./routes/routes.js";

const app = express();

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not configured; database-backed auth will fail.");
}

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not configured; token generation will fail.");
}

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN?.split(",").map((origin) => origin.trim()) || true,
}));
app.use(express.json());
app.use("/api/v1/", routes.router);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});