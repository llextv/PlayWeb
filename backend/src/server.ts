import express from "express";
import { prisma } from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import routes from "./routes/routes.js";

const app = express();

app.use(express.json());
app.use("/api/v1/", routes.router);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});