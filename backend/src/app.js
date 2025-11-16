// backend/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import adminPlansRoutes from "./routes/adminPlansRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import { startDailyJobs } from "./cron/dailyJobs.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import adminTransactionRoutes from "./routes/adminTransactionRoutes.js";
import affiliateRoutes from "./routes/affiliateRoutes.js";
import depositRoutes from "./routes/depositRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminUsersRoutes from "./routes/adminUsers.js";
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (e.g., Postman, curl)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://146.70.35.241",
      "https://146.70.35.241",
      "http://impulseedge.com",
      "https://impulseedge.com"
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());


startDailyJobs();


// Routes
app.use("/api/users", userRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/plans", planRoutes);

app.use("/api/invest", investmentRoutes);
app.use("/api/withdraw", withdrawalRoutes);
app.use("/api/affiliate", affiliateRoutes);
app.use("/api/deposits", depositRoutes);


app.use("/api/admin/plans", adminPlansRoutes);
app.use("/api/admin/transactions", adminTransactionRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/users", adminUsersRoutes);




export default app;
