import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
} from "../controllers/adminUsers.js"; 

const router = express.Router();

// GET /api/admin/users
router.get("/", protect, adminOnly, getAllUsers);

// GET /api/admin/users/:id
router.get("/:id", protect, adminOnly, getUserById);

// PUT /api/admin/users/:id/role
router.put("/:id/role", protect, adminOnly, updateUserRole);

export default router;
