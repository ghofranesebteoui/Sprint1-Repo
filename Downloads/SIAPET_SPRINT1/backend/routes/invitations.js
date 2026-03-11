const express = require("express");
const router = express.Router();
const invitationController = require("../controllers/invitationController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Routes protégées - Admin uniquement
router.post(
  "/trigger",
  authenticateToken,
  requireAdmin,
  invitationController.triggerInvitations,
);

router.get(
  "/stats",
  authenticateToken,
  requireAdmin,
  invitationController.getInvitationStats,
);

module.exports = router;
