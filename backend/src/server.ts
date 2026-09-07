import express from "express";
import { prisma } from "./config/prisma.js";

const app = express();

app.get("/", async (req, res) => {
  try {
    await prisma.$connect();

    res.json({
      message: "API OK",
      database: "connected"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});