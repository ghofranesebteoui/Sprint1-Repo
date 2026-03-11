const { sequelize } = require("../models");
const emailService = require("../utils/emailService");

// Prévisualiser le nombre de destinataires
exports.previewRecipients = async (req, res) => {
  try {
    const { roles, regions, villes, etablissements, universites, statut } = req.body;

    console.log('Preview recipients - Filtres reçus:', { roles, regions, villes, etablissements, universites, statut });

    // Construction de la requête SQL avec filtres
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    // Filtre par rôles
    if (roles && roles.length > 0) {
      whereConditions.push(`u.type_utilisateur = ANY($${paramIndex})`);
      params.push(roles);
      paramIndex++;
    }

    // Filtre par statut
    if (statut && statut !== '') {
      whereConditions.push(`u.statut = $${paramIndex}`);
      params.push(statut);
      paramIndex++;
    }

    // Filtre par régions
    if (regions && regions.length > 0) {
      whereConditions.push(`(v.id_region = ANY($${paramIndex}) OR v_etab.id_region = ANY($${paramIndex}))`);
      params.push(regions);
      paramIndex++;
    }

    // Filtre par villes
    if (villes && villes.length > 0) {
      whereConditions.push(`(et.id_ville = ANY($${paramIndex}) OR e.id_ville = ANY($${paramIndex}))`);
      params.push(villes);
      paramIndex++;
    }

    // Filtre par établissements
    if (etablissements && etablissements.length > 0) {
      whereConditions.push(`e.id_etablissement = ANY($${paramIndex})`);
      params.push(etablissements);
      paramIndex++;
    }

    // Filtre par universités
    if (universites && universites.length > 0) {
      whereConditions.push(`rec.id_rectorat = ANY($${paramIndex})`);
      params.push(universites);
      paramIndex++;
    }

    const whereClause =
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    console.log('WHERE clause:', whereClause);
    console.log('Params:', params);

    const countQuery = `
      SELECT COUNT(DISTINCT u.numero_utilisateur) as count
      FROM utilisateur u
      LEFT JOIN etudiant et ON u.numero_utilisateur = et.numero_utilisateur
      LEFT JOIN enseignant ens ON u.numero_utilisateur = ens.numero_utilisateur
      LEFT JOIN ville v ON et.id_ville = v.id_ville
      LEFT JOIN region r ON v.id_region = r.id_region
      LEFT JOIN inscription i ON u.numero_utilisateur = i.numero_utilisateur
      LEFT JOIN etablissement e ON i.id_etablissement = e.id_etablissement
      LEFT JOIN ville v_etab ON e.id_ville = v_etab.id_ville
      LEFT JOIN region r_etab ON v_etab.id_region = r_etab.id_region
      LEFT JOIN rectorat rec ON e.id_rectorat = rec.id_rectorat
      ${whereClause}
    `;

    const result = await sequelize.query(countQuery, {
      bind: params,
      type: sequelize.QueryTypes.SELECT,
    });

    console.log('Résultat count:', result[0]);

    res.json({ count: parseInt(result[0].count) });
  } catch (error) {
    console.error("Erreur lors du comptage des destinataires:", error);
    res.status(500).json({
      message: "Erreur lors du comptage des destinataires",
      error: error.message,
    });
  }
};

// Récupérer les emails des destinataires
const getRecipientEmails = async (filters) => {
  const { roles, regions, villes, etablissements, universites, statut } = filters;

  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  // Filtre par rôles
  if (roles && roles.length > 0) {
    whereConditions.push(`u.type_utilisateur = ANY($${paramIndex})`);
    params.push(roles);
    paramIndex++;
  }

  // Filtre par statut
  if (statut && statut !== '') {
    whereConditions.push(`u.statut = $${paramIndex}`);
    params.push(statut);
    paramIndex++;
  }

  // Filtre par régions
  if (regions && regions.length > 0) {
    whereConditions.push(`(v.id_region = ANY($${paramIndex}) OR v_etab.id_region = ANY($${paramIndex}))`);
    params.push(regions);
    paramIndex++;
  }

  // Filtre par villes
  if (villes && villes.length > 0) {
    whereConditions.push(`(et.id_ville = ANY($${paramIndex}) OR e.id_ville = ANY($${paramIndex}))`);
    params.push(villes);
    paramIndex++;
  }

  // Filtre par établissements
  if (etablissements && etablissements.length > 0) {
    whereConditions.push(`e.id_etablissement = ANY($${paramIndex})`);
    params.push(etablissements);
    paramIndex++;
  }

  // Filtre par universités
  if (universites && universites.length > 0) {
    whereConditions.push(`rec.id_rectorat = ANY($${paramIndex})`);
    params.push(universites);
    paramIndex++;
  }

  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const query = `
    SELECT DISTINCT
      u.email,
      u.nom,
      u.prenom
    FROM utilisateur u
    LEFT JOIN etudiant et ON u.numero_utilisateur = et.numero_utilisateur
    LEFT JOIN enseignant ens ON u.numero_utilisateur = ens.numero_utilisateur
    LEFT JOIN ville v ON et.id_ville = v.id_ville
    LEFT JOIN region r ON v.id_region = r.id_region
    LEFT JOIN inscription i ON u.numero_utilisateur = i.numero_utilisateur
    LEFT JOIN etablissement e ON i.id_etablissement = e.id_etablissement
    LEFT JOIN ville v_etab ON e.id_ville = v_etab.id_ville
    LEFT JOIN region r_etab ON v_etab.id_region = r_etab.id_region
    LEFT JOIN rectorat rec ON e.id_rectorat = rec.id_rectorat
    ${whereClause}
  `;

  const recipients = await sequelize.query(query, {
    bind: params,
    type: sequelize.QueryTypes.SELECT,
  });

  return recipients;
};

// Envoyer un email groupé
exports.broadcastEmail = async (req, res) => {
  try {
    const { subject, message, recipients: filters } = req.body;

    // Validation
    if (!subject || !subject.trim()) {
      return res.status(400).json({ message: "L'objet de l'email est requis" });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Le message est requis" });
    }

    // Récupérer les destinataires
    const recipients = await getRecipientEmails(filters);

    if (recipients.length === 0) {
      return res.status(400).json({ message: "Aucun destinataire trouvé" });
    }

    console.log(`Envoi d'email à ${recipients.length} destinataire(s)`);

    // Envoyer les emails
    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const recipient of recipients) {
      try {
        // Personnaliser le message avec le nom du destinataire
        const personalizedMessage = `Bonjour ${recipient.prenom} ${recipient.nom},\n\n${message}\n\nCordialement,\nL'équipe MESRS`;

        await emailService.sendEmail(
          recipient.email,
          subject,
          personalizedMessage
        );
        sent++;
      } catch (error) {
        console.error(`Erreur lors de l'envoi à ${recipient.email}:`, error.message);
        failed++;
        errors.push({
          email: recipient.email,
          error: error.message,
        });
      }
    }

    console.log(`Emails envoyés: ${sent}, Échecs: ${failed}`);

    res.json({
      message: `Email envoyé avec succès à ${sent} destinataire(s)`,
      sent,
      failed,
      total: recipients.length,
      errors: failed > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email groupé:", error);
    res.status(500).json({
      message: "Erreur lors de l'envoi de l'email groupé",
      error: error.message,
    });
  }
};

// Obtenir l'historique des emails envoyés (optionnel - nécessite une table d'historique)
exports.getEmailHistory = async (req, res) => {
  try {
    // TODO: Implémenter si vous voulez garder un historique des emails envoyés
    // Nécessite la création d'une table email_history
    res.json({
      message: "Fonctionnalité d'historique non encore implémentée",
      history: [],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'historique",
      error: error.message,
    });
  }
};

module.exports = exports;
