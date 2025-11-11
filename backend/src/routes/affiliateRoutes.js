import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAffiliateDashboard , getReferralTiers } from "../controllers/affiliateController.js";

const router = express.Router();

router.get("/dashboard", protect, getAffiliateDashboard);
router.get("/tiers", protect, getReferralTiers);

export default router;