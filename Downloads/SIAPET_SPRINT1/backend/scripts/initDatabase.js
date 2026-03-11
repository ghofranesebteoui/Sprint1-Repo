const { sequelize } = require("../models");
const User = require("../models/User");
const Etudiant = require("../models/Etudiant");
const Enseignant = require("../models/Enseignant");
const Directeur = require("../models/Directeur");
const Etablissement = require("../models/Etablissement");
const DemandeAcces = require("../models/DemandeAcces");
const bcrypt = require("bcrypt");

async function initDatabase() {
  try {
    console.log("🔄 Connexion à la base de données...");
    await sequelize.authenticate();
    console.log("✅ Connexion réussie");

    console.log("\n🔄 Création des tables...");

    // Synchroniser tous les modèles (créer les tables)
    await sequelize.sync({ force: false }); // force: false pour ne pas supprimer les données existantes

    console.log("✅ Tables créées avec succès");

    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({
      where: { type_utilisateur: "ADMIN_MESRS" },
    });

    if (!adminExists) {
      console.log("\n🔄 Création du compte administrateur...");

      const adminData = {
        numero_utilisateur: "ADMIN001",
        nom: "Administrateur",
        prenom: "SIAPET",
        email: "admin@siapet.rnu.tn",
        mot_de_passe: "Admin@2026",
        type_utilisateur: "ADMIN_MESRS",
        statut: "ACTIF",
      };

      await User.create(adminData);

      console.log("✅ Compte administrateur créé avec succès");
      console.log("\n📧 Identifiants de connexion:");
      console.log("   Email: admin@siapet.rnu.tn");
      console.log("   Mot de passe: Admin@2026");
      console.log("\n⚠️  Changez ce mot de passe après la première connexion!");
    } else {
      console.log("\n✅ Un compte administrateur existe déjà");
    }

    console.log(
      "\n✅ Initialisation de la base de données terminée avec succès!",
    );
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erreur lors de l'initialisation:", error);
    process.exit(1);
  }
}

initDatabase();
