import {
  dbGetAllUsers,
  dbGetUserById,
  dbUpdateUserRole,
} from "../models/adminUsers.js";

/* ------------------------------------------
   GET ALL USERS (with search, filter, pagination)
------------------------------------------- */
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      role = "All",
    } = req.query;

    const offset = (page - 1) * limit;

    const { users, total } = await dbGetAllUsers({
      search,
      role,
      limit,
      offset,
    });

    return res.json({
      success: true,
      page: Number(page),
      total,
      users,
    });

  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ------------------------------------------
   GET SINGLE USER
------------------------------------------- */
export const getUserById = async (req, res) => {
  try {
    const user = await dbGetUserById(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, user });
  } catch (error) {
    console.error("GET USER ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ------------------------------------------
   UPDATE USER ROLE
------------------------------------------- */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role.toLowerCase()))
      return res.status(400).json({ success: false, message: "Invalid role" });

    const updated = await dbUpdateUserRole(req.params.id, role.toLowerCase());

    if (!updated)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, message: "Role updated successfully" });

  } catch (error) {
    console.error("UPDATE ROLE ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
