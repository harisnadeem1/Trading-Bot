import express from "express";
import { getPlans, createPlan, updatePlan, deletePlan } from "../controllers/adminPlansController.js";

const router = express.Router();

router.get("/", getPlans);          // Fetch all plans
router.post("/", createPlan);       // Create new plan
router.put("/:id", updatePlan);     // Update plan
router.delete("/:id", deletePlan);  // Delete plan

export default router;
