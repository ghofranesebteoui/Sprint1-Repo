const socketIo = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Utilisateur connecté: ${socket.id}`);

    // Rejoindre une room spécifique pour les admins
    socket.on("join-admin", (adminId) => {
      socket.join("admin-room");
      console.log(`Admin ${adminId} a rejoint la room admin`);
    });

    // Quitter la room admin
    socket.on("leave-admin", (adminId) => {
      socket.leave("admin-room");
      console.log(`Admin ${adminId} a quitté la room admin`);
    });

    socket.on("disconnect", () => {
      console.log(`Utilisateur déconnecté: ${socket.id}`);
    });
  });

  return io;
};

// Fonction pour envoyer une notification de nouvelle demande d'accès
const notifyNewDemandeAcces = (demandeData) => {
  if (io) {
    io.to("admin-room").emit("nouvelle-demande-acces", {
      id_demande: demandeData.id_demande,
      type_acteur: demandeData.type_acteur,
      nom: demandeData.nom,
      prenom: demandeData.prenom,
      email: demandeData.email,
      date_demande: demandeData.date_demande,
      message: `Nouvelle demande d'accès ${demandeData.type_acteur} de ${demandeData.prenom} ${demandeData.nom}`,
    });
    console.log(
      `Notification envoyée pour la demande ${demandeData.id_demande}`,
    );
  }
};

// Fonction pour notifier la mise à jour d'une demande
const notifyDemandeUpdate = (demandeData, action) => {
  if (io) {
    io.to("admin-room").emit("demande-mise-a-jour", {
      id_demande: demandeData.id_demande,
      action: action, // 'accepte' ou 'refuse'
      type_acteur: demandeData.type_acteur,
      nom: demandeData.nom,
      prenom: demandeData.prenom,
      message: `Demande ${action} pour ${demandeData.prenom} ${demandeData.nom}`,
    });
    console.log(
      `Notification de mise à jour envoyée pour la demande ${demandeData.id_demande}`,
    );
  }
};

// Fonction pour obtenir le nombre d'admins connectés
const getConnectedAdmins = () => {
  if (io) {
    const adminRoom = io.sockets.adapter.rooms.get("admin-room");
    return adminRoom ? adminRoom.size : 0;
  }
  return 0;
};

module.exports = {
  initializeSocket,
  notifyNewDemandeAcces,
  notifyDemandeUpdate,
  getConnectedAdmins,
};
