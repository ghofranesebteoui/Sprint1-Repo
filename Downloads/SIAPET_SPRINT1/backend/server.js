const express = require("express");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./socket/socketHandler");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const etablissementRoutes = require("./routes/etablissements");
const departementRoutes = require("./routes/departements");
const etudiantRoutes = require("./routes/etudiant");
const profileRoutes = require("./routes/profile");
const demandesAccesRoutes = require("./routes/demandesAcces");
const emailBroadcastRoutes = require("./routes/emailBroadcast");
const invitationRoutes = require("./routes/invitations");

const app = express();
const server = http.createServer(app);

// Initialiser Socket.IO
const io = initializeSocket(server);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/etablissements", etablissementRoutes);
app.use("/api/departements", departementRoutes);
app.use("/api/etudiant", etudiantRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/demandes-acces", demandesAccesRoutes);
app.use("/api/emails", emailBroadcastRoutes);
app.use("/api/invitations", invitationRoutes);

// Health check
app.get("/health", (req, res) => {
  const useDatabase = process.env.USE_DATABASE === "true";
  res.json({
    status: "OK",
    message: "SIAPET API is running",
    mode: useDatabase ? "production" : "development",
    database: useDatabase ? "PostgreSQL" : "Mock Data",
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
const USE_DATABASE = process.env.USE_DATABASE === "true";

if (USE_DATABASE) {
  // Mode avec base de données
  const { sequelize } = require("./models");

  sequelize
    .authenticate()
    .then(() => {
      console.log("Connexion à la base de données réussie");
      server.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur le port ${PORT}`);
        console.log(`📡 Socket.IO activé pour les notifications temps réel`);
      });
    })
    .catch((err) => {
      console.error("Connexion à la base de données échouée:", err.message);
      process.exit(1);
    });
} else {
  // Mode sans base de données (mock)
  server.listen(PORT, () => {
    console.log("Connexion en mode MOCK réussie");
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 Socket.IO activé pour les notifications temps réel`);
  });
}
