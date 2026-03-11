import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Paper,
} from '@mui/material';
import { ArrowBack, Send, People } from '@mui/icons-material';
import api from '../services/api';

const Invitations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const roles = [
    {
      value: 'etudiant',
      label: 'Étudiants',
      color: '#43e97b',
      icon: '🎓',
      description: 'Envoyer des invitations aux étudiants',
    },
    {
      value: 'enseignant',
      label: 'Enseignants',
      color: '#4facfe',
      icon: '👨‍🏫',
      description: 'Envoyer des invitations aux enseignants',
    },
    {
      value: 'directeur',
      label: 'Directeurs',
      color: '#f093fb',
      icon: '👔',
      description: 'Envoyer des invitations aux directeurs',
    },
    {
      value: 'recteur',
      label: 'Recteurs',
      color: '#667eea',
      icon: '🎩',
      description: 'Envoyer des invitations aux recteurs',
    },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/invitations/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const handleRoleToggle = (roleValue) => {
    setSelectedRoles((prev) =>
      prev.includes(roleValue)
        ? prev.filter((r) => r !== roleValue)
        : [...prev, roleValue]
    );
  };

  const handleSendInvitations = async () => {
    if (selectedRoles.length === 0) {
      setMessage({
        type: 'error',
        text: 'Veuillez sélectionner au moins un rôle',
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/invitations/trigger', {
        roles: selectedRoles,
      });

      setMessage({
        type: 'success',
        text: response.data.message,
      });
      setSelectedRoles([]);
      fetchStats();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erreur lors de l\'envoi des invitations',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard/admin')}
          sx={{
            mb: 2,
            color: '#636E72',
            textTransform: 'none',
            '&:hover': { background: '#FFF4E6' },
          }}
        >
          Retour au tableau de bord
        </Button>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Crimson Pro", serif',
            fontWeight: 700,
            color: '#2D3436',
            mb: 0.5,
          }}
        >
          ✉️ Envoi d'invitations
        </Typography>
        <Typography variant="body1" sx={{ color: '#636E72', fontSize: '1.05rem' }}>
          Envoyez des emails d'invitation personnalisés aux utilisateurs selon leur rôle
        </Typography>
      </Box>

      {/* Message */}
      {message.text && (
        <Alert
          severity={message.type}
          onClose={() => setMessage({ type: '', text: '' })}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {message.text}
        </Alert>
      )}

      {/* Statistiques */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stats.total_users}
                </Typography>
                <Typography variant="body2">Total utilisateurs</Typography>
              </CardContent>
            </Card>
          </Grid>
          {roles.map((role) => (
            <Grid item xs={12} sm={6} md={2.4} key={role.value}>
              <Card
                sx={{
                  borderRadius: 2,
                  border: `2px solid ${role.color}30`,
                  background: `${role.color}10`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <span style={{ fontSize: '1.5rem' }}>{role.icon}</span>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {stats.by_role[role.value] || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#636E72' }}>
                    {role.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Sélection des rôles */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            👥 Sélectionnez les destinataires
          </Typography>
          <Typography variant="body2" sx={{ color: '#636E72', mb: 3 }}>
            Choisissez les rôles des utilisateurs qui recevront l'email d'invitation personnalisé
          </Typography>

          <Grid container spacing={2}>
            {roles.map((role) => (
              <Grid item xs={12} sm={6} key={role.value}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: `2px solid ${
                      selectedRoles.includes(role.value) ? role.color : '#E8E8E8'
                    }`,
                    background: selectedRoles.includes(role.value)
                      ? `${role.color}10`
                      : 'white',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: role.color,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${role.color}30`,
                    },
                  }}
                  onClick={() => handleRoleToggle(role.value)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedRoles.includes(role.value)}
                        onChange={() => handleRoleToggle(role.value)}
                        sx={{
                          color: role.color,
                          '&.Mui-checked': {
                            color: role.color,
                          },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ fontSize: '1.5rem' }}>{role.icon}</span>
                          <Typography sx={{ fontWeight: 600 }}>{role.label}</Typography>
                          {stats && (
                            <Chip
                              label={stats.by_role[role.value] || 0}
                              size="small"
                              sx={{
                                background: role.color,
                                color: 'white',
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: '#636E72', ml: 4 }}>
                          {role.description}
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Aperçu du contenu */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            📧 Aperçu du contenu de l'email
          </Typography>
          <Box
            sx={{
              background: '#FFF4E6',
              p: 3,
              borderRadius: 2,
              border: '2px solid #FFE5CC',
            }}
          >
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
              L'email contiendra :
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#636E72' }}>
              <li>Une présentation de la plateforme SIAPET</li>
              <li>
                Des avantages personnalisés selon le rôle (étudiant, enseignant, directeur,
                recteur)
              </li>
              <li>Un lien vers la page de demande d'accès</li>
              <li>Des instructions pour compléter la demande (rôle, CIN, email)</li>
            </ul>
            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
              Les demandes d'accès seront envoyées à l'administrateur pour validation
            </Alert>
          </Box>
        </CardContent>
      </Card>

      {/* Bouton d'envoi */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard/admin')}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderColor: '#636E72',
            color: '#636E72',
            '&:hover': {
              borderColor: '#2D3436',
              background: '#FFF4E6',
            },
          }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
          onClick={handleSendInvitations}
          disabled={loading || selectedRoles.length === 0}
          sx={{
            background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
            color: 'white',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3db8af 0%, #3a8f7d 100%)',
              boxShadow: '0 6px 16px rgba(78, 205, 196, 0.4)',
            },
            '&:disabled': {
              background: '#E8E8E8',
              color: '#A89F96',
            },
          }}
        >
          {loading ? 'Envoi en cours...' : 'Envoyer les invitations'}
        </Button>
      </Box>
    </Box>
  );
};

export default Invitations;
