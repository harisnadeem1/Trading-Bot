import express from "express";
import {
  getAllTransactions,
  updateTransactionStatus,
} from "../controllers/adminTransactionController.js";

const router = express.Router();

router.get("/",  getAllTransactions);
router.patch("/:id/status",  updateTransactionStatus);

export default router;
