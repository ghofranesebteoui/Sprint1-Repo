const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User, Etudiant, Enseignant } = require("../models");
const {
  generateMatriculeEtudiant,
  generateMatriculeEnseignant,
  generateTemporaryPassword,
} = require("../utils/matriculeGenerator");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/emailService");
const {
  generateNumeroUtilisateur,
} = require("../utils/numeroUtilisateurGenerator");
const mockDataService = require("../services/mockDataService");

// Vérifier si on utilise la base de données ou les mock data
const USE_DATABASE = process.env.USE_DATABASE === "true";

// Inscription Étape 1 - Informations de base
const registerStep1 = async (req, res) => {
  try {
    const { nom, prenom, email, role } = req.body;

    // Validation
    if (!nom || !prenom || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    if (!["ETUDIANT", "ENSEIGNANT"].includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Rôle invalide. Seuls les étudiants et enseignants peuvent s'inscrire",
      });
    }

    // Vérifier si l'email existe déjà
    if (USE_DATABASE) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé",
        });
      }
    } else {
      // Mode mock
      const emailExists = await mockDataService.emailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé",
        });
      }
    }

    res.json({
      success: true,
      message: "Étape 1 validée",
      data: { nom, prenom, email, role },
    });
  } catch (error) {
    console.error("Erreur registerStep1:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Inscription Étape 2 - Informations complémentaires et création du compte
const registerStep2 = async (req, res) => {
  try {
    console.log("📝 Données reçues:", req.body);

    const {
      nom,
      prenom,
      email,
      role,
      telephone,
      sexe,
      ville_id,
      ...extraData
    } = req.body;

    console.log("✅ Données extraites:", {
      nom,
      prenom,
      email,
      role,
      telephone,
      sexe,
      ville_id,
      extraData,
    });

    // Validation
    if (!nom || !prenom || !email || !role || !sexe || !ville_id) {
      console.log("❌ Validation échouée - champs manquants");
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis",
      });
    }

    // Convertir ville_id en entier
    const villeIdInt = parseInt(ville_id, 10);
    if (isNaN(villeIdInt)) {
      console.log("❌ ville_id invalide:", ville_id);
      return res.status(400).json({
        success: false,
        message: "ID de ville invalide",
      });
    }

    console.log("🔐 Génération du mot de passe temporaire...");
    // Générer mot de passe temporaire
    const motDePasseTemporaire = generateTemporaryPassword();

    console.log("👤 Création de l'utilisateur...");
    // Générer un numéro d'utilisateur unique selon le rôle
    const numeroUtilisateur = await generateNumeroUtilisateur(role);
    console.log("📋 Numéro utilisateur généré:", numeroUtilisateur);

    // Créer l'utilisateur
    const user = await User.create({
      numero_utilisateur: numeroUtilisateur,
      nom,
      prenom,
      email,
      mot_de_passe: motDePasseTemporaire,
      telephone,
      sexe,
      statut: "ACTIF",
      type_utilisateur: role,
    });

    console.log("✅ Utilisateur créé avec numero:", user.numero_utilisateur);

    let matricule;

    // Créer le profil spécifique selon le rôle
    if (role === "ETUDIANT") {
      console.log("🎓 Création du profil étudiant...");
      matricule = await generateMatriculeEtudiant();
      console.log("📋 Matricule généré:", matricule);

      await Etudiant.create({
        numero_utilisateur: user.numero_utilisateur,
        numero_etudiant: matricule,
        date_naissance: extraData.date_naissance,
        cin: extraData.cin,
        filiere: extraData.filiere || "",
        id_ville: villeIdInt,
      });
      console.log("✅ Profil étudiant créé");
    } else if (role === "ENSEIGNANT") {
      console.log("👨‍🏫 Création du profil enseignant...");
      matricule = await generateMatriculeEnseignant();
      console.log("📋 Matricule généré:", matricule);

      await Enseignant.create({
        numero_utilisateur: user.numero_utilisateur,
        numero_enseignant: matricule,
        cin: extraData.cin,
        grade: extraData.grade,
        date_recrutement: new Date(),
        specialite: extraData.specialite || "",
        annees_experience: extraData.annees_experience || 0,
      });
      console.log("✅ Profil enseignant créé");
    }

    console.log("📧 Envoi de l'email de vérification...");
    // Envoyer l'email de vérification (ne pas bloquer si ça échoue)
    try {
      await sendVerificationEmail(
        email,
        nom,
        prenom,
        matricule,
        motDePasseTemporaire,
        role,
      );
      console.log("✅ Email envoyé avec succès");
    } catch (emailError) {
      console.warn(
        "⚠️ Erreur lors de l'envoi de l'email (inscription réussie quand même):",
        emailError.message,
      );
    }

    console.log("✅ Inscription terminée avec succès");
    res.status(201).json({
      success: true,
      message: "Inscription réussie ! Un email de vérification a été envoyé.",
      data: {
        matricule,
        email,
        motDePasseTemporaire, // Temporairement pour le développement
      },
    });
  } catch (error) {
    console.error("❌ Erreur registerStep2:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
};

// Connexion
const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    // MODE MOCK DATA
    if (!USE_DATABASE) {
      console.log("🎭 MODE MOCK ACTIVÉ - Utilisation des données de test");

      const user = await mockDataService.login(email, mot_de_passe);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email ou mot de passe incorrect",
        });
      }

      // Générer le token JWT
      const token = jwt.sign(
        {
          numero_utilisateur: user.numero_utilisateur,
          email: user.email,
          role: user.type_utilisateur,
        },
        process.env.JWT_SECRET || "votre_secret_jwt_super_securise",
        { expiresIn: "24h" },
      );

      return res.json({
        success: true,
        message: "Connexion réussie (MODE MOCK)",
        data: {
          token,
          user: {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.type_utilisateur,
            profil: user.profil,
          },
        },
      });
    }

    // MODE BASE DE DONNÉES (code original)
    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        numero_utilisateur: user.numero_utilisateur,
        email: user.email,
        role: user.type_utilisateur,
      },
      process.env.JWT_SECRET || "votre_secret_jwt_super_securise",
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      message: "Connexion réussie",
      data: {
        token,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.type_utilisateur,
        },
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Demande de réinitialisation de mot de passe
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email requis",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe
      return res.json({
        success: true,
        message:
          "Si cet email existe, un lien de réinitialisation a été envoyé",
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Stocker le token (vous devrez ajouter ces champs à votre modèle User)
    user.reset_token = resetTokenHash;
    user.reset_token_expiry = new Date(Date.now() + 3600000); // 1 heure
    await user.save();

    // Envoyer l'email
    await sendPasswordResetEmail(email, user.nom, user.prenom, resetToken);

    res.json({
      success: true,
      message: "Si cet email existe, un lien de réinitialisation a été envoyé",
    });
  } catch (error) {
    console.error("Erreur requestPasswordReset:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  try {
    const { token, nouveau_mot_de_passe } = req.body;

    if (!token || !nouveau_mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: "Token et nouveau mot de passe requis",
      });
    }

    // Hasher le token pour le comparer
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Trouver l'utilisateur avec ce token valide
    const user = await User.findOne({
      where: {
        reset_token: resetTokenHash,
      },
    });

    if (!user || new Date() > new Date(user.reset_token_expiry)) {
      return res.status(400).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }

    // Mettre à jour le mot de passe
    user.mot_de_passe = nouveau_mot_de_passe;
    user.reset_token = null;
    user.reset_token_expiry = null;
    await user.save();

    res.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Changer le mot de passe (pour utilisateur connecté)
const changePassword = async (req, res) => {
  try {
    const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;
    const userId = req.user.id; // Depuis le middleware d'authentification

    if (!ancien_mot_de_passe || !nouveau_mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: "Ancien et nouveau mot de passe requis",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await user.comparePassword(ancien_mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Ancien mot de passe incorrect",
      });
    }

    // Mettre à jour le mot de passe
    user.mot_de_passe = nouveau_mot_de_passe;
    await user.save();

    res.json({
      success: true,
      message: "Mot de passe changé avec succès",
    });
  } catch (error) {
    console.error("Erreur changePassword:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

module.exports = {
  registerStep1,
  registerStep2,
  login,
  requestPasswordReset,
  resetPassword,
  changePassword,
};
