import express from "express";
import { lockUser, unlockUser } from "../controllers/adminUserController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/users/:id/lock", protect, adminOnly, lockUser);
router.post("/users/:id/unlock", protect, adminOnly, unlockUser);

export default router;
