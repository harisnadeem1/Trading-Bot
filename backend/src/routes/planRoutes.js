import express from "express";
import { getAllPlans } from "../controllers/planController.js";

const router = express.Router();

// GET /api/plans
router.get("/", getAllPlans);

export default router;
