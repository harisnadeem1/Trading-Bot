import express from "express";
import { getWithdrawOptions, createWithdrawal, getWithdrawHistory } from "../controllers/withdrawalController.js";
import { protect } from "../middleware/authMiddleware.js"; // ensure user is authenticated

const router = express.Router();

router.get("/options", protect, getWithdrawOptions);
router.post("/request", protect, createWithdrawal);

router.get("/history", protect, getWithdrawHistory);
export default router;
