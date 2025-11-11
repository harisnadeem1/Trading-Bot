import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

// Example: GET /api/dashboard/:userId
router.get("/:userId", getDashboardData);

export default router;
