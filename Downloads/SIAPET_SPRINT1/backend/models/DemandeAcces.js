const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DemandeAcces = sequelize.define(
  "DemandeAcces",
  {
    id_demande: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type_acteur: {
      type: DataTypes.ENUM("etudiant", "enseignant", "directeur", "recteur"),
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    telephone: {
      type: DataTypes.STRING(20),
    },
    date_naissance: {
      type: DataTypes.DATEONLY,
    },
    cin: {
      type: DataTypes.STRING(20),
    },
    niveau_etude: {
      type: DataTypes.STRING(50),
    },
    specialite: {
      type: DataTypes.STRING(100),
    },
    annee_universitaire: {
      type: DataTypes.STRING(20),
    },
    grade: {
      type: DataTypes.STRING(50),
    },
    specialite_enseignement: {
      type: DataTypes.STRING(100),
    },
    etablissement_souhaite: {
      type: DataTypes.STRING(255),
    },
    statut: {
      type: DataTypes.ENUM("en_attente", "accepte", "refuse"),
      defaultValue: "en_attente",
    },
    date_demande: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    date_traitement: {
      type: DataTypes.DATE,
    },
    traite_par: {
      type: DataTypes.STRING(50),
    },
    commentaire_admin: {
      type: DataTypes.TEXT,
    },
    numero_utilisateur: {
      type: DataTypes.STRING(50),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "demandes_acces",
    timestamps: false,
  }
);

module.exports = DemandeAcces;
