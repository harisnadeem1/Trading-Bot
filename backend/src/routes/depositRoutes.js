import express from "express";
import {
  getDepositWallets,
  createDeposit,
  getDepositHistory
} from "../controllers/depositController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route: get active deposit wallets
router.get("/wallets", getDepositWallets);

// Protected routes
router.post("/", protect, createDeposit);
router.get("/history", protect, getDepositHistory);

export default router;
