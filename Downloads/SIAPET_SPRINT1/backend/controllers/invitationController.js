const User = require("../models/User");
const axios = require("axios");

// Déclencher l'envoi d'invitations via n8n
exports.triggerInvitations = async (req, res) => {
  try {
    const { roles } = req.body; // Array de roles: ['etudiant', 'enseignant', 'directeur', 'recteur']

    // Vérifier que l'utilisateur est admin
    if (req.user.type_utilisateur !== "ADMIN_MESRS") {
      return res.status(403).json({
        message:
          "Accès refusé. Seuls les administrateurs peuvent envoyer des invitations.",
      });
    }

    // Valider les rôles
    const validRoles = ["etudiant", "enseignant", "directeur", "recteur"];
    const selectedRoles =
      roles && roles.length > 0
        ? roles.filter((role) => validRoles.includes(role))
        : validRoles;

    if (selectedRoles.length === 0) {
      return res.status(400).json({
        message: "Aucun rôle valide sélectionné",
      });
    }

    // Appeler le webhook n8n avec les rôles sélectionnés
    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      "http://localhost:5678/webhook/send-invitations";

    try {
      const response = await axios.post(n8nWebhookUrl, {
        roles: selectedRoles,
        triggered_by: req.user.numero_utilisateur,
        triggered_at: new Date().toISOString(),
      });

      res.json({
        message: `Processus d'envoi d'invitations déclenché avec succès pour les rôles: ${selectedRoles.join(", ")}`,
        roles: selectedRoles,
        workflow_status: response.data,
      });
    } catch (n8nError) {
      console.error("Erreur lors de l'appel au webhook n8n:", n8nError.message);
      res.status(500).json({
        message: "Erreur lors du déclenchement du workflow n8n",
        error: n8nError.message,
        roles: selectedRoles,
      });
    }
  } catch (error) {
    console.error("Erreur lors du déclenchement des invitations:", error);
    res.status(500).json({
      message: "Erreur lors du déclenchement des invitations",
      error: error.message,
    });
  }
};

// Obtenir les statistiques d'envoi
exports.getInvitationStats = async (req, res) => {
  try {
    const stats = {
      total_users: await User.count(),
      by_role: {
        etudiant: await User.count({ where: { type_utilisateur: "ETUDIANT" } }),
        enseignant: await User.count({
          where: { type_utilisateur: "ENSEIGNANT" },
        }),
        directeur: await User.count({
          where: { type_utilisateur: "DIRECTEUR" },
        }),
        recteur: await User.count({ where: { type_utilisateur: "RECTEUR" } }),
      },
    };

    res.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques",
      error: error.message,
    });
  }
};
