const express = require("express");
const router = express.Router();
const emailBroadcastController = require("../controllers/emailBroadcastController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Toutes les routes nécessitent une authentification admin
router.use(authenticateToken);
router.use(requireAdmin);

// Prévisualiser le nombre de destinataires
router.post("/preview-recipients", emailBroadcastController.previewRecipients);

// Envoyer un email groupé
router.post("/broadcast", emailBroadcastController.broadcastEmail);

// Obtenir l'historique des emails (optionnel)
router.get("/history", emailBroadcastController.getEmailHistory);

module.exports = router;
