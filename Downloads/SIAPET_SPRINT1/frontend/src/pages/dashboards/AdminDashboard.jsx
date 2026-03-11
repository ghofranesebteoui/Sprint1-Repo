import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  People,
  School,
  Person,
  SupervisorAccount,
  AccountBalance,
  Close,
} from '@mui/icons-material';
import StatCard from '../../components/Dashboard/StatCard';
import useSocket from '../../hooks/useSocket';
import api from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userManagementDialogOpen, setUserManagementDialogOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // Hook Socket.IO
  const { joinAdminRoom, leaveAdminRoom, onNewDemandeAcces, onDemandeUpdate, off } = useSocket();

  // Récupérer l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Rejoindre la room admin si l'utilisateur est admin
    if (user.role === 'ADMIN_MESRS' || user.type_utilisateur === 'ADMIN_MESRS') {
      joinAdminRoom(user.numero_utilisateur || user.id);
    }

    // Récupérer le nombre de demandes en attente
    fetchPendingDemandesCount();

    // Écouter les nouvelles demandes d'accès
    const handleNewDemande = (data) => {
      console.log('📨 Nouvelle demande d\'accès reçue:', data);
      setPendingCount(prev => prev + 1);
      setNotification({
        open: true,
        message: `Nouvelle demande d'accès ${data.type_acteur} de ${data.prenom} ${data.nom}`,
        severity: 'info'
      });
    };

    // Écouter les mises à jour de demandes
    const handleDemandeUpdate = (data) => {
      console.log('🔄 Mise à jour de demande:', data);
      if (data.action === 'accepte' || data.action === 'refuse') {
        setPendingCount(prev => Math.max(0, prev - 1));
        setNotification({
          open: true,
          message: `Demande ${data.action} pour ${data.prenom} ${data.nom}`,
          severity: data.action === 'accepte' ? 'success' : 'warning'
        });
      }
    };

    onNewDemandeAcces(handleNewDemande);
    onDemandeUpdate(handleDemandeUpdate);

    // Cleanup
    return () => {
      if (user.role === 'ADMIN_MESRS' || user.type_utilisateur === 'ADMIN_MESRS') {
        leaveAdminRoom(user.numero_utilisateur || user.id);
      }
      off('nouvelle-demande-acces', handleNewDemande);
      off('demande-mise-a-jour', handleDemandeUpdate);
    };
  }, [user, joinAdminRoom, leaveAdminRoom, onNewDemandeAcces, onDemandeUpdate, off]);

  const fetchPendingDemandesCount = async () => {
    try {
      const response = await api.get('/demandes-acces?statut=en_attente');
      setPendingCount(response.data.length);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const userTypes = [
    {
      role: 'RECTEUR',
      label: 'Recteurs',
      icon: <AccountBalance sx={{ fontSize: 50 }} />,
      gradient: 'linear-gradient(135deg, #2575E8 0%, #1050B0 100%)',
      color: '#2575E8',
      description: 'Gérer les recteurs des universités',
    },
    {
      role: 'DIRECTEUR',
      label: 'Directeurs',
      icon: <SupervisorAccount sx={{ fontSize: 50 }} />,
      gradient: 'linear-gradient(135deg, #529BF5 0%, #2575E8 100%)',
      color: '#529BF5',
      description: 'Gérer les directeurs d\'établissements',
    },
    {
      role: 'ENSEIGNANT',
      label: 'Enseignants',
      icon: <Person sx={{ fontSize: 50 }} />,
      gradient: 'linear-gradient(135deg, #2DC9B4 0%, #1BA898 100%)',
      color: '#2DC9B4',
      description: 'Gérer les enseignants',
    },
    {
      role: 'ETUDIANT',
      label: 'Étudiants',
      icon: <School sx={{ fontSize: 50 }} />,
      gradient: 'linear-gradient(135deg, #FF9A3C 0%, #FF8A3C 100%)',
      color: '#FF9A3C',
      description: 'Gérer les étudiants',
    },
  ];

  const handleUserTypeClick = (role) => {
    setUserManagementDialogOpen(false);
    navigate(`/dashboard/admin/users/${role.toLowerCase()}`);
  };

  const performanceData = [
    { year: '2021', taux: 72 },
    { year: '2022', taux: 74.5 },
    { year: '2023', taux: 76 },
    { year: '2024', taux: 76.8 },
    { year: '2025', taux: 78.5 },
  ];

  const etablissements = [
    {
      code: 'UT-001',
      nom: 'Université de Tunis',
      type: 'Université',
      effectif: 45200,
      taux: 78,
      statut: 'excellent',
    },
    {
      code: 'UTM-002',
      nom: 'Université de Tunis El Manar',
      type: 'Université',
      effectif: 38500,
      taux: 76,
      statut: 'bon',
    },
    {
      code: 'UC-003',
      nom: 'Université de Carthage',
      type: 'Université',
      effectif: 32100,
      taux: 74,
      statut: 'bon',
    },
    {
      code: 'UM-004',
      nom: 'Université de la Manouba',
      type: 'Université',
      effectif: 28900,
      taux: 72,
      statut: 'bon',
    },
    {
      code: 'ISET-RAD-015',
      nom: 'ISET de Radès',
      type: 'ISET',
      effectif: 2800,
      taux: 68,
      statut: 'risque',
    },
  ];

  const alertes = [
    {
      type: 'danger',
      etablissement: 'Université de Sfax - Filière Informatique',
      message: 'Taux de réussite: 52% (-12% vs moyenne)',
    },
    {
      type: 'warning',
      etablissement: 'ISET de Sousse - DUT Génie Civil',
      message: "Taux d'absentéisme: 31%",
    },
    {
      type: 'warning',
      etablissement: 'Faculté de Droit de Tunis - L1',
      message: 'Baisse de performance: -7%',
    },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ 
        mb: 3, 
        p: 3,
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FBFF 100%)',
        borderBottom: '1px solid #E8EEF7',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: 3,
        flexWrap: 'wrap',
      }}>
        <Box sx={{ flex: '1 1 auto', minWidth: '250px' }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2575E8 0%, #1050B0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 0.5,
              letterSpacing: '-0.5px',
              fontSize: '26px',
            }}
          >
            Vue d'ensemble nationale
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748B', 
              fontSize: '13.5px',
              fontWeight: 500,
              fontFamily: '"Nunito Sans", sans-serif',
            }}
          >
            Ministère de l'Enseignement Supérieur • Tunisie
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<People sx={{ fontSize: 18 }} />}
            onClick={() => setUserManagementDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #FF9A7F 0%, #FF6B47 100%)',
              color: 'white',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              py: 1.2,
              fontSize: '13.5px',
              fontFamily: '"Nunito Sans", sans-serif',
              boxShadow: '0 4px 15px rgba(255, 154, 127, 0.4)',
              border: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8A6F 0%, #FF5B37 100%)',
                boxShadow: '0 6px 20px rgba(255, 154, 127, 0.5)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Gestion des utilisateurs
          </Button>
          <Button
            variant="contained"
            startIcon={<span style={{ fontSize: '16px' }}>✉️</span>}
            onClick={() => navigate('/dashboard/admin/invitations')}
            sx={{
              background: 'linear-gradient(135deg, #4FD1C5 0%, #2CB5AA 100%)',
              color: 'white',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              py: 1.2,
              fontSize: '13.5px',
              fontFamily: '"Nunito Sans", sans-serif',
              boxShadow: '0 4px 15px rgba(79, 209, 197, 0.4)',
              border: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #3FC1B5 0%, #1CA59A 100%)',
                boxShadow: '0 6px 20px rgba(79, 209, 197, 0.5)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Invitations
          </Button>
          <Button
            variant="contained"
            startIcon={<span style={{ fontSize: '16px' }}>📋</span>}
            onClick={() => navigate('/dashboard/admin/demandes-acces')}
            sx={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
              color: 'white',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              py: 1.2,
              fontSize: '13.5px',
              fontFamily: '"Nunito Sans", sans-serif',
              boxShadow: '0 4px 15px rgba(167, 139, 250, 0.4)',
              border: 'none',
              position: 'relative',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #977BEA 0%, #6C2ADD 100%)',
                boxShadow: '0 6px 20px rgba(167, 139, 250, 0.5)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Demandes d'accès
            {pendingCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  background: 'linear-gradient(135deg, #FF6B47 0%, #FF5733 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  minWidth: 26,
                  height: 26,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '0 6px',
                  animation: 'pulse 2s infinite',
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(255, 107, 71, 0.4)',
                }}
              >
                {pendingCount > 99 ? '99+' : pendingCount}
              </Box>
            )}
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taux de réussite national"
            value="76.8%"
            change="+2.1% vs année précédente"
            changeType="positive"
            icon="📈"
            iconBg="coral"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Universités publiques"
            value="13"
            change="+1 nouvelle université"
            changeType="positive"
            icon="🏫"
            iconBg="mint"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Étudiants inscrits"
            value="285,420"
            change="+6.3% vs l'an dernier"
            changeType="positive"
            icon="👥"
            iconBg="lavender"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Budget MESRS"
            value="2.4 Mds TND"
            change="+5.8% d'augmentation"
            changeType="positive"
            icon="💰"
            iconBg="peach"
          />
        </Grid>
        </Grid>

        {/* Chart */}
        <Card sx={{ borderRadius: 3, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              📈 Évolution du taux de réussite (5 ans)
            </Typography>
            <Typography
              sx={{
                color: '#2575E8',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                '&:hover': { opacity: 0.7 },
              }}
            >
              Voir détails →
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
              <XAxis dataKey="year" stroke="#636E72" />
              <YAxis stroke="#636E72" domain={[70, 80]} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="taux"
                stroke="#2575E8"
                strokeWidth={3}
                dot={{ fill: '#2575E8', r: 6 }}
                name="Taux de réussite (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
        </Card>

        <Grid container spacing={2}>
          {/* Alertes */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ borderRadius: 3, height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ⚠️ Alertes établissements
                </Typography>
                <Chip
                  label="5 alertes"
                  size="small"
                  sx={{
                    background: '#EFF6FF',
                    color: '#2575E8',
                    fontWeight: 800,
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {alertes.map((alerte, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 1.5,
                      borderLeft: 4,
                      borderColor: alerte.type === 'danger' ? '#FF6B47' : '#F5A623',
                      background: alerte.type === 'danger' ? '#EFF6FF' : '#EFF6FF',
                      borderRadius: 2,
                      display: 'flex',
                      gap: 1.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        boxShadow: '0 6px 20px rgba(37, 117, 232, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ fontSize: '1.5rem' }}>
                      {alerte.type === 'danger' ? '🔴' : '🟠'}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, mb: 0.25, fontSize: '0.95rem', color: '#0C1B3E' }}>
                        {alerte.etablissement}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#5D7AAA' }}>
                        {alerte.message}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

          {/* Top Établissements */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ borderRadius: 3, height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  🏆 Top établissements
                </Typography>
                <Typography
                  sx={{
                    color: '#1A62D4',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.7 },
                  }}
                >
                  Voir tout →
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, background: '#EFF6FF' }}>
                        Établissement
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, background: '#EFF6FF' }}>
                        Taux
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, background: '#EFF6FF' }}>
                        Statut
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ '&:hover': { background: '#EAF2FF' } }}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Université de Tunis El Manar
                      </TableCell>
                      <TableCell>82%</TableCell>
                      <TableCell>
                        <Chip
                          label="Excellent"
                          size="small"
                          sx={{
                            background: '#E8FAF0',
                            color: '#22C55E',
                            fontWeight: 800,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:hover': { background: '#EAF2FF' } }}>
                      <TableCell sx={{ fontWeight: 600 }}>Université de Carthage</TableCell>
                      <TableCell>79%</TableCell>
                      <TableCell>
                        <Chip
                          label="Très bon"
                          size="small"
                          sx={{
                            background: '#E8FAF0',
                            color: '#22C55E',
                            fontWeight: 800,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:hover': { background: '#EAF2FF' } }}>
                      <TableCell sx={{ fontWeight: 600 }}>Université de Sfax</TableCell>
                      <TableCell>77%</TableCell>
                      <TableCell>
                        <Chip
                          label="Bon"
                          size="small"
                          sx={{
                            background: '#E8FAF0',
                            color: '#22C55E',
                            fontWeight: 800,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

          {/* Table Établissements */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                🏫 Tous les établissements
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, background: '#EFF6FF' }}>
                        Code
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, background: '#EFF6FF' }}>
                        Nom
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, background: '#EFF6FF' }}>
                        Type
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, background: '#EFF6FF' }}>
                        Effectif
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, background: '#EFF6FF' }}>
                        Taux réussite
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, background: '#EFF6FF' }}>
                        Statut
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, background: '#EFF6FF' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {etablissements.map((etab) => (
                      <TableRow
                        key={etab.code}
                        sx={{
                          '&:hover': { background: '#EAF2FF' },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600 }}>{etab.code}</TableCell>
                        <TableCell>{etab.nom}</TableCell>
                        <TableCell>{etab.type}</TableCell>
                        <TableCell>{etab.effectif.toLocaleString()}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{etab.taux}%</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              etab.statut === 'excellent'
                                ? 'Excellent'
                                : etab.statut === 'bon'
                                ? 'Bon'
                                : 'À risque'
                            }
                            size="small"
                            sx={{
                              background:
                                etab.statut === 'excellent'
                                  ? '#E8FAF0'
                                  : etab.statut === 'bon'
                                  ? '#EDF4FF'
                                  : '#FFF0EC',
                              color:
                                etab.statut === 'excellent'
                                  ? '#22C55E'
                                  : etab.statut === 'bon'
                                  ? '#2575E8'
                                  : '#FF6B47',
                              fontWeight: 800,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: 22,
                              textTransform: 'none',
                              borderColor: '#1A62D4',
                              color: '#1A62D4',
                              fontWeight: 800,
                              '&:hover': {
                                borderColor: '#1A62D4',
                                background: '#EFF6FF',
                              },
                            }}
                          >
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Dialog de sélection du type d'utilisateur */}
      <Dialog
        open={userManagementDialogOpen}
        onClose={() => setUserManagementDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #EAF2FF 0%, #DAEAFF 100%)',
            color: '#0C1B3E',
            fontWeight: 900,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2.5,
            px: 3,
            borderBottom: '1px solid #C8DCFF',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <People sx={{ fontSize: 28, color: '#2575E8' }} />
            <span style={{ fontSize: '1.25rem' }}>Gestion des utilisateurs</span>
          </Box>
          <IconButton
            onClick={() => setUserManagementDialogOpen(false)}
            sx={{
              color: '#5D7AAA',
              '&:hover': { background: '#D8EAFF' },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, background: '#ffffff' }}>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: '#5D7AAA',
              fontSize: '0.95rem',
              textAlign: 'center',
            }}
          >
            Sélectionnez le type d'utilisateur que vous souhaitez gérer
          </Typography>
          <Grid container spacing={2}>
            {userTypes.map((userType) => (
              <Grid item xs={6} key={userType.role}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '2px solid transparent',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 24px ${userType.color}30`,
                      borderColor: userType.color,
                      '& .icon-circle': {
                        transform: 'scale(1.1)',
                      },
                    },
                    '&:active': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => handleUserTypeClick(userType.role)}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: userType.gradient,
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center', p: 2.5, pt: 3 }}>
                    <Box
                      className="icon-circle"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: userType.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        color: 'white',
                        boxShadow: `0 4px 12px ${userType.color}40`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {React.cloneElement(userType.icon, { sx: { fontSize: 32 } })}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        mb: 0.5,
                        color: '#0C1B3E',
                        fontSize: '1rem',
                      }}
                    >
                      {userType.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#5D7AAA',
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {userType.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
