const DemandeAcces = require("../models/DemandeAcces");
const User = require("../models/User");
const Etudiant = require("../models/Etudiant");
const Enseignant = require("../models/Enseignant");
const bcrypt = require("bcrypt");
const emailService = require("../utils/emailService");
const matriculeGenerator = require("../utils/matriculeGenerator");
const numeroUtilisateurGenerator = require("../utils/numeroUtilisateurGenerator");
const {
  notifyNewDemandeAcces,
  notifyDemandeUpdate,
} = require("../socket/socketHandler");

// Soumettre une nouvelle demande d'accès
exports.soumettreDemande = async (req, res) => {
  try {
    const {
      type_acteur,
      nom,
      prenom,
      email,
      telephone,
      date_naissance,
      cin,
      niveau_etude,
      specialite,
      annee_universitaire,
      grade,
      specialite_enseignement,
      etablissement_souhaite,
    } = req.body;

    // Vérifier si l'email existe déjà dans les demandes
    const demandeExistante = await DemandeAcces.findOne({ where: { email } });
    if (demandeExistante) {
      return res.status(400).json({
        message: "Une demande avec cet email existe déjà",
      });
    }

    // Vérifier si l'email existe déjà dans les utilisateurs
    const userExistant = await User.findOne({ where: { email } });
    if (userExistant) {
      return res.status(400).json({
        message: "Un compte avec cet email existe déjà",
      });
    }

    // Créer la demande
    const demande = await DemandeAcces.create({
      type_acteur,
      nom,
      prenom,
      email,
      telephone,
      date_naissance,
      cin,
      niveau_etude,
      specialite,
      annee_universitaire,
      grade,
      specialite_enseignement,
      etablissement_souhaite,
    });

    // Notifier les admins en temps réel
    notifyNewDemandeAcces(demande);

    res.status(201).json({
      message: "Votre demande d'accès a été soumise avec succès",
      demande: {
        id_demande: demande.id_demande,
        type_acteur: demande.type_acteur,
        nom: demande.nom,
        prenom: demande.prenom,
        email: demande.email,
        statut: demande.statut,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la soumission de la demande:", error);
    res.status(500).json({
      message: "Erreur lors de la soumission de la demande",
      error: error.message,
    });
  }
};

// Récupérer toutes les demandes (admin)
exports.getAllDemandes = async (req, res) => {
  try {
    const { statut, type_acteur } = req.query;
    const where = {};

    if (statut) where.statut = statut;
    if (type_acteur) where.type_acteur = type_acteur;

    const demandes = await DemandeAcces.findAll({
      where,
      order: [["date_demande", "DESC"]],
    });

    res.json(demandes);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des demandes",
      error: error.message,
    });
  }
};

// Récupérer une demande par ID (admin)
exports.getDemandeById = async (req, res) => {
  try {
    const { id } = req.params;
    const demande = await DemandeAcces.findByPk(id);

    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    res.json(demande);
  } catch (error) {
    console.error("Erreur lors de la récupération de la demande:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de la demande",
      error: error.message,
    });
  }
};

// Accepter une demande (admin)
exports.accepterDemande = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.numero_utilisateur;

    const demande = await DemandeAcces.findByPk(id);

    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    if (demande.statut !== "en_attente") {
      return res.status(400).json({
        message: "Cette demande a déjà été traitée",
      });
    }

    // Générer un mot de passe temporaire
    const motDePasseTemporaire = Math.random().toString(36).slice(-8);

    // Générer le numéro utilisateur selon le type
    let typeUtilisateur;
    let numeroUtilisateur;

    switch (demande.type_acteur) {
      case "etudiant":
        typeUtilisateur = "ETUDIANT";
        numeroUtilisateur =
          await numeroUtilisateurGenerator.generateNumeroUtilisateur(
            "ETUDIANT",
          );
        break;
      case "enseignant":
        typeUtilisateur = "ENSEIGNANT";
        numeroUtilisateur =
          await numeroUtilisateurGenerator.generateNumeroUtilisateur(
            "ENSEIGNANT",
          );
        break;
      case "directeur":
        typeUtilisateur = "DIRECTEUR";
        numeroUtilisateur =
          await numeroUtilisateurGenerator.generateNumeroUtilisateur(
            "DIRECTEUR",
          );
        break;
      case "recteur":
        typeUtilisateur = "RECTEUR";
        numeroUtilisateur =
          await numeroUtilisateurGenerator.generateNumeroUtilisateur("RECTEUR");
        break;
    }

    // Créer l'utilisateur
    const user = await User.create({
      numero_utilisateur: numeroUtilisateur,
      nom: demande.nom,
      prenom: demande.prenom,
      email: demande.email,
      mot_de_passe: motDePasseTemporaire,
      telephone: demande.telephone,
      type_utilisateur: typeUtilisateur,
      statut: "ACTIF",
    });

    // Créer l'entrée spécifique selon le type
    let matricule = null;
    if (demande.type_acteur === "etudiant") {
      matricule = await matriculeGenerator.generateMatricule();
      await Etudiant.create({
        numero_utilisateur: numeroUtilisateur,
        matricule: matricule,
        date_naissance: demande.date_naissance,
        cin: demande.cin,
        niveau_etude: demande.niveau_etude,
        specialite: demande.specialite,
        annee_universitaire: demande.annee_universitaire,
      });
    } else if (demande.type_acteur === "enseignant") {
      await Enseignant.create({
        numero_utilisateur: numeroUtilisateur,
        grade: demande.grade,
        specialite: demande.specialite_enseignement,
        date_naissance: demande.date_naissance,
        cin: demande.cin,
      });
    }

    // Mettre à jour la demande
    await demande.update({
      statut: "accepte",
      date_traitement: new Date(),
      traite_par: adminId,
      numero_utilisateur: numeroUtilisateur,
    });

    // Envoyer l'email avec les identifiants
    try {
      await emailService.sendAccessGrantedEmail({
        email: demande.email,
        nom: demande.nom,
        prenom: demande.prenom,
        numeroUtilisateur: numeroUtilisateur,
        motDePasse: motDePasseTemporaire,
        matricule: matricule,
        typeActeur: demande.type_acteur,
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
    }

    // Notifier les admins de l'acceptation
    notifyDemandeUpdate(demande, "accepte");

    res.json({
      message: "Demande acceptée avec succès",
      user: {
        numero_utilisateur: numeroUtilisateur,
        email: user.email,
        type_utilisateur: typeUtilisateur,
        matricule: matricule,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'acceptation de la demande:", error);
    res.status(500).json({
      message: "Erreur lors de l'acceptation de la demande",
      error: error.message,
    });
  }
};

// Refuser une demande (admin)
exports.refuserDemande = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentaire_admin } = req.body;
    const adminId = req.user.numero_utilisateur;

    const demande = await DemandeAcces.findByPk(id);

    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    if (demande.statut !== "en_attente") {
      return res.status(400).json({
        message: "Cette demande a déjà été traitée",
      });
    }

    await demande.update({
      statut: "refuse",
      date_traitement: new Date(),
      traite_par: adminId,
      commentaire_admin: commentaire_admin || "Demande refusée",
    });

    // Notifier les admins du refus
    notifyDemandeUpdate(demande, "refuse");

    res.json({
      message: "Demande refusée",
      demande: {
        id_demande: demande.id_demande,
        statut: demande.statut,
      },
    });
  } catch (error) {
    console.error("Erreur lors du refus de la demande:", error);
    res.status(500).json({
      message: "Erreur lors du refus de la demande",
      error: error.message,
    });
  }
};

// Statistiques des demandes (admin)
exports.getStatistiquesDemandes = async (req, res) => {
  try {
    const total = await DemandeAcces.count();
    const enAttente = await DemandeAcces.count({
      where: { statut: "en_attente" },
    });
    const acceptees = await DemandeAcces.count({
      where: { statut: "accepte" },
    });
    const refusees = await DemandeAcces.count({ where: { statut: "refuse" } });

    const parType = await DemandeAcces.findAll({
      attributes: [
        "type_acteur",
        [sequelize.fn("COUNT", sequelize.col("id_demande")), "count"],
      ],
      group: ["type_acteur"],
    });

    res.json({
      total,
      enAttente,
      acceptees,
      refusees,
      parType,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques",
      error: error.message,
    });
  }
};
