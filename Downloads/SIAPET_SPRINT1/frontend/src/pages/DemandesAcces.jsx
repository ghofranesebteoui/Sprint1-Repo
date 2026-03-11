import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  Divider,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Visibility,
  Check,
  Close,
  Refresh,
  Person,
  Email,
  Phone,
  Badge,
  School,
  CalendarToday,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from '@mui/icons-material';
import api from '../services/api';

const DemandesAcces = () => {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [refuseOpen, setRefuseOpen] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/demandes-acces');
      setDemandes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la récupération des demandes',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccepter = async (id) => {
    try {
      await api.post(`/demandes-acces/${id}/accepter`);
      setMessage({
        type: 'success',
        text: 'Demande acceptée avec succès',
      });
      fetchDemandes();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erreur lors de l\'acceptation',
      });
    }
  };

  const handleRefuser = async () => {
    try {
      await api.post(`/demandes-acces/${selectedDemande.id_demande}/refuser`, {
        commentaire_admin: commentaire,
      });
      setMessage({
        type: 'warning',
        text: 'Demande refusée',
      });
      setRefuseOpen(false);
      setCommentaire('');
      fetchDemandes();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erreur lors du refus',
      });
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'en_attente':
        return { color: '#FF9800', bg: '#FFF3E0' };
      case 'accepte':
        return { color: '#4CAF50', bg: '#E8F5E8' };
      case 'refuse':
        return { color: '#F44336', bg: '#FFEBEE' };
      default:
        return { color: '#757575', bg: '#F5F5F5' };
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'en_attente':
        return 'En attente';
      case 'accepte':
        return 'Acceptée';
      case 'refuse':
        return 'Refusée';
      default:
        return statut;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'etudiant':
        return '🎓 Étudiant';
      case 'enseignant':
        return '👨‍🏫 Enseignant';
      case 'directeur':
        return '👔 Directeur';
      case 'recteur':
        return '🎩 Recteur';
      default:
        return role;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5F7 0%, #FFF9E6 50%, #F0F8FF 100%)',
      p: 4,
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard/admin')}
          sx={{
            mb: 3,
            color: '#636E72',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '50px',
            px: 3,
            py: 1,
            background: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            '&:hover': { 
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Retour au tableau de bord
        </Button>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Crimson Pro", serif',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              📋 Demandes d'accès
            </Typography>
            <Typography variant="body1" sx={{ color: '#636E72', fontSize: '1.1rem' }}>
              Gérez les demandes d'accès à la plateforme SIAPET
            </Typography>
          </Box>
          <Button
            startIcon={<Refresh />}
            onClick={fetchDemandes}
            variant="contained"
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF5252 0%, #FF7043 100%)',
                boxShadow: '0 6px 16px rgba(255, 107, 107, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {/* Message */}
      {message.text && (
        <Alert
          severity={message.type}
          onClose={() => setMessage({ type: '', text: '' })}
          sx={{ 
            mb: 3, 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          {message.text}
        </Alert>
      )}

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 8px 30px rgba(255, 152, 0, 0.25)',
            },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                  width: 56,
                  height: 56,
                }}>
                  <HourglassEmpty sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#E65100', mb: 0.5 }}>
                {demandes.filter(d => d.statut === 'en_attente').length}
              </Typography>
              <Typography variant="body1" sx={{ color: '#E65100', fontWeight: 600 }}>
                En attente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 8px 30px rgba(76, 175, 80, 0.25)',
            },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                  width: 56,
                  height: 56,
                }}>
                  <CheckCircle sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#2E7D32', mb: 0.5 }}>
                {demandes.filter(d => d.statut === 'accepte').length}
              </Typography>
              <Typography variant="body1" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                Acceptées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(244, 67, 54, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 8px 30px rgba(244, 67, 54, 0.25)',
            },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
                  width: 56,
                  height: 56,
                }}>
                  <Cancel sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#C62828', mb: 0.5 }}>
                {demandes.filter(d => d.statut === 'refuse').length}
              </Typography>
              <Typography variant="body1" sx={{ color: '#C62828', fontWeight: 600 }}>
                Refusées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 8px 30px rgba(33, 150, 243, 0.25)',
            },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                  width: 56,
                  height: 56,
                }}>
                  <Badge sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1565C0', mb: 0.5 }}>
                {demandes.length}
              </Typography>
              <Typography variant="body1" sx={{ color: '#1565C0', fontWeight: 600 }}>
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table des demandes */}
      <Card sx={{ 
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                }}>
                  <TableCell sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Demandeur</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Rôle</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {demandes.map((demande) => {
                  const statutStyle = getStatutColor(demande.statut);
                  return (
                    <TableRow
                      key={demande.id_demande}
                      sx={{ 
                        '&:hover': { 
                          background: 'linear-gradient(135deg, #FFF5F7 0%, #FFF9E6 100%)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                            width: 40,
                            height: 40,
                          }}>
                            {demande.prenom[0]}{demande.nom[0]}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                              {demande.prenom} {demande.nom}
                            </Typography>
                            {demande.cin && (
                              <Typography variant="caption" sx={{ color: '#636E72' }}>
                                CIN: {demande.cin}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                          {getRoleLabel(demande.type_acteur)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.9rem' }}>
                          {demande.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.9rem' }}>
                          {new Date(demande.date_demande).toLocaleDateString('fr-FR')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatutLabel(demande.statut)}
                          size="medium"
                          sx={{
                            background: statutStyle.bg,
                            color: statutStyle.color,
                            fontWeight: 600,
                            borderRadius: '50px',
                            px: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Voir détails">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedDemande(demande);
                                setDetailsOpen(true);
                              }}
                              sx={{ 
                                color: '#667eea',
                                background: '#F3F0FF',
                                '&:hover': {
                                  background: '#E5DEFF',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {demande.statut === 'en_attente' && (
                            <>
                              <Tooltip title="Accepter">
                                <IconButton
                                  size="small"
                                  onClick={() => handleAccepter(demande.id_demande)}
                                  sx={{ 
                                    color: '#43e97b',
                                    background: '#E8FFF3',
                                    '&:hover': {
                                      background: '#D0FFE8',
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <Check />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Refuser">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedDemande(demande);
                                    setRefuseOpen(true);
                                  }}
                                  sx={{ 
                                    color: '#f5576c',
                                    background: '#FFF0F3',
                                    '&:hover': {
                                      background: '#FFE0E6',
                                      transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <Close />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog Détails */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              width: 56, 
              height: 56,
              background: 'white',
              color: '#667eea',
              fontSize: '1.5rem',
              fontWeight: 700,
            }}>
              {selectedDemande?.prenom[0]}{selectedDemande?.nom[0]}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Détails de la demande
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {selectedDemande?.prenom} {selectedDemande?.nom}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4, mt: 2 }}>
          {selectedDemande && (
            <Stack spacing={3}>
              {/* Informations personnelles */}
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: '#2D3436',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Person /> Informations personnelles
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      border: 'none',
                      color: 'white',
                    }}>
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}>
                        Nom complet
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mt: 0.5 }}>
                        {selectedDemande.prenom} {selectedDemande.nom}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      border: 'none',
                      color: 'white',
                    }}>
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}>
                        Rôle demandé
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mt: 0.5 }}>
                        {getRoleLabel(selectedDemande.type_acteur)}
                      </Typography>
                    </Paper>
                  </Grid>
                  {selectedDemande.cin && (
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ 
                        p: 2, 
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        border: 'none',
                        color: 'white',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Badge sx={{ color: 'white', fontSize: 18 }} />
                          <Typography variant="caption" sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                          }}>
                            CIN
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                          {selectedDemande.cin}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      color: 'white',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <CalendarToday sx={{ color: 'white', fontSize: 18 }} />
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}>
                          Date de demande
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                        {new Date(selectedDemande.date_demande).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* Coordonnées */}
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: '#2D3436',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Email /> Coordonnées
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                      border: 'none',
                      color: 'white',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Email sx={{ color: 'white', fontSize: 18 }} />
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}>
                          Email
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'white', wordBreak: 'break-word' }}>
                        {selectedDemande.email}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                      border: 'none',
                      color: 'white',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Phone sx={{ color: 'white', fontSize: 18 }} />
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}>
                          Téléphone
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                        {selectedDemande.telephone || 'Non renseigné'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* Établissement */}
              {selectedDemande.etablissement_souhaite && (
                <Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    color: '#2D3436',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <School /> Établissement
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Paper sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    border: 'none',
                    color: 'white',
                  }}>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>
                      Établissement souhaité
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mt: 1 }}>
                      {selectedDemande.etablissement_souhaite}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {/* Statut */}
              <Box>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: getStatutColor(selectedDemande.statut).bg,
                  border: `2px solid ${getStatutColor(selectedDemande.statut).color}`,
                  textAlign: 'center',
                }}>
                  <Typography variant="caption" sx={{ 
                    color: '#636E72',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    Statut de la demande
                  </Typography>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: getStatutColor(selectedDemande.statut).color,
                    mt: 1,
                  }}>
                    {getStatutLabel(selectedDemande.statut)}
                  </Typography>
                </Paper>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, background: '#F8F9FA' }}>
          <Button 
            onClick={() => setDetailsOpen(false)}
            variant="contained"
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Refus */}
      <Dialog
        open={refuseOpen}
        onClose={() => setRefuseOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
          color: 'white',
          py: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              width: 56, 
              height: 56,
              background: 'white',
              color: '#f5576c',
            }}>
              <Close sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Refuser la demande
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Cette action est irréversible
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4, mt: 2 }}>
          <Paper sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
            border: '2px solid #EF9A9A',
          }}>
            <Typography variant="body1" sx={{ color: '#2D3436', fontWeight: 600 }}>
              Vous êtes sur le point de refuser la demande de :
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#f5576c',
              fontWeight: 700,
              mt: 1,
            }}>
              {selectedDemande?.prenom} {selectedDemande?.nom}
            </Typography>
            <Typography variant="body2" sx={{ color: '#636E72', mt: 1 }}>
              {getRoleLabel(selectedDemande?.type_acteur)}
            </Typography>
          </Paper>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Commentaire (optionnel)"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Expliquez la raison du refus..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&:hover fieldset': {
                  borderColor: '#f5576c',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f5576c',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, background: '#F8F9FA', gap: 2 }}>
          <Button 
            onClick={() => setRefuseOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              borderColor: '#636E72',
              color: '#636E72',
              '&:hover': {
                borderColor: '#2D3436',
                background: '#F8F9FA',
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleRefuser}
            variant="contained"
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e04858 0%, #e082ea 100%)',
              },
            }}
          >
            Confirmer le refus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DemandesAcces;