import pool from "../config/db.js";

export const getReferralLink = async (req, res) => {
    console.log("🔍 Fetching referral link for user ID:", req.user.id);
  try {
    const userId = req.user.id;
    const user = await pool.query(
      "SELECT referral_code FROM users WHERE id = $1",
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const referralCode = user.rows[0].referral_code;
    const baseUrl = process.env.REFERRAL_BASE_URL || "https://novatrade.ai/ref";
    const referralLink = `${baseUrl}/${referralCode}`;

    res.json({ referral_code: referralCode, referral_link: referralLink });
  } catch (error) {
    console.error("❌ Error fetching referral link:", error);
    res.status(500).json({ message: "Server error" });
  }
};
