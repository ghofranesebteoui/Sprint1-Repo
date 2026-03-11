import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (serverUrl = "http://localhost:5000") => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Créer la connexion socket
    socketRef.current = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Connecté au serveur Socket.IO:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Déconnecté du serveur Socket.IO");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Erreur de connexion Socket.IO:", error);
    });

    // Cleanup lors du démontage du composant
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [serverUrl]);

  // Fonction pour rejoindre la room admin
  const joinAdminRoom = (adminId) => {
    if (socketRef.current) {
      socketRef.current.emit("join-admin", adminId);
      console.log("🔐 Rejoint la room admin:", adminId);
    }
  };

  // Fonction pour quitter la room admin
  const leaveAdminRoom = (adminId) => {
    if (socketRef.current) {
      socketRef.current.emit("leave-admin", adminId);
      console.log("🚪 Quitté la room admin:", adminId);
    }
  };

  // Fonction pour écouter les nouvelles demandes d'accès
  const onNewDemandeAcces = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("nouvelle-demande-acces", callback);
    }
  };

  // Fonction pour écouter les mises à jour de demandes
  const onDemandeUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("demande-mise-a-jour", callback);
    }
  };

  // Fonction pour arrêter d'écouter un événement
  const off = (eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.off(eventName, callback);
    }
  };

  return {
    socket: socketRef.current,
    joinAdminRoom,
    leaveAdminRoom,
    onNewDemandeAcces,
    onDemandeUpdate,
    off,
  };
};

export default useSocket;
