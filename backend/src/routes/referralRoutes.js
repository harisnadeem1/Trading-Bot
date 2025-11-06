import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getReferralLink } from "../controllers/referralController.js";

const router = express.Router();

// ✅ GET /api/referral/link – returns the user’s referral link
router.get("/link", protect, getReferralLink);

export default router;
