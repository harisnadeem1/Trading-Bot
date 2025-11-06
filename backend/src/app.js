// backend/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());



// Routes
app.use("/api/users", userRoutes);
app.use("/api/referral", referralRoutes);




export default app;
