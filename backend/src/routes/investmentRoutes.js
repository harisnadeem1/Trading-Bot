import express from "express";
import { startInvestment, getActiveInvestment } from "../controllers/investmentController.js";
import { protect } from "../middleware/authMiddleware.js"; // adjust path if needed

const router = express.Router();

// POST /invest/start
router.post("/start", protect, startInvestment);

router.get("/active", protect, getActiveInvestment);
export default router;
