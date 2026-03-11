import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  School,
  TrendingUp,
  Security,
} from '@mui/icons-material';
import axios from 'axios';
import config from '../config';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.apiUrl}/api/auth/login`, {
        email: formData.email,
        mot_de_passe: formData.mot_de_passe,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        let userRole = response.data.data.user.role.toLowerCase();
        const roleMapping = {
          admin_mesrs: 'admin',
          recteur: 'recteur',
          directeur: 'directeur',
          enseignant: 'enseignant',
          etudiant: 'etudiant',
        };

        const dashboardRoute = roleMapping[userRole] || userRole;
        navigate(`/dashboard/${dashboardRoute}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE5CC 50%, #FFCCBC 100%)',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            gap: 0,
            maxWidth: 1100,
            height: { xs: 'auto', md: '90vh' },
            maxHeight: { md: '650px' },
            mx: 'auto',
            boxShadow: '0 20px 60px rgba(255, 107, 107, 0.2)',
            borderRadius: 4,
            overflow: 'hidden',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Carte gauche - Section promotionnelle */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
              color: 'white',
              p: { xs: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              minHeight: { xs: 250, md: 'auto' },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  mb: 2.5,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '1px',
                }}
              >
                ★ PLATEFORME OFFICIELLE
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: { xs: '2rem', md: '3rem' },
                  lineHeight: 1.2,
                }}
              >
                GÉREZ
                <br />
                <span style={{ fontStyle: 'italic', fontWeight: 400 }}>
                  votre parcours
                </span>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  opacity: 0.95,
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  maxWidth: 400,
                }}
              >
                Pilotez, suivez et optimisez votre expérience éducative depuis un
                espace sécurisé et intuitif
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <School sx={{ fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      Accès Instantané
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', opacity: 0.9 }}>
                      Connexion en un clic et navigation sécurisée
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Security sx={{ fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      100% Sécurisé
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', opacity: 0.9 }}>
                      Vos données sont chiffrées et protégées
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      Suivi en Temps Réel
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', opacity: 0.9 }}>
                      Tableaux de bord et statistiques actualisés
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Carte droite - Formulaire de connexion */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              background: 'white',
              p: { xs: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: { xs: 'auto', md: 'auto' },
            }}
          >
            <Box sx={{ maxWidth: 380, mx: 'auto', width: '100%' }}>
              {/* Logo et titre */}
              <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5,
                    fontSize: '1.8rem',
                  }}
                >
                  SIAPET
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#636E72',
                    fontSize: '0.75rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  — ESPACE SÉCURISÉ
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: '#636E72',
                  mb: 2.5,
                  textAlign: 'center',
                  fontSize: '0.85rem',
                }}
              >
                Entrez vos identifiants pour accéder à votre espace personnalisé
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#2D3436',
                      fontWeight: 600,
                      mb: 0.7,
                      display: 'block',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Adresse Email
                  </Typography>
                  <TextField
                    fullWidth
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="prenom.nom@universite.tn"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#B2BEC3', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover': {
                          border: '1px solid #FFB088',
                        },
                        '&.Mui-focused': {
                          border: '1px solid #FF6B6B',
                          boxShadow: '0 0 0 3px rgba(255, 107, 107, 0.1)',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        py: 1.2,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#2D3436',
                      fontWeight: 600,
                      mb: 0.7,
                      display: 'block',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Mot de Passe
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    name="mot_de_passe"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    required
                    placeholder="••••••••••"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#B2BEC3', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <VisibilityOff sx={{ fontSize: 20 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 20 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover': {
                          border: '1px solid #FFB088',
                        },
                        '&.Mui-focused': {
                          border: '1px solid #FF6B6B',
                          boxShadow: '0 0 0 3px rgba(255, 107, 107, 0.1)',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        py: 1.2,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ textAlign: 'right', mb: 2 }}>
                  <Link
                    href="/forgot-password"
                    sx={{
                      color: '#FF6B6B',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Mot de passe oublié ?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB088 100%)',
                      boxShadow: '0 6px 16px rgba(255, 107, 107, 0.4)',
                    },
                    '&:disabled': {
                      background: '#DFE6E9',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} sx={{ color: 'white' }} />
                  ) : (
                    <>
                      <Lock sx={{ mr: 1, fontSize: 17 }} />
                      Se connecter
                    </>
                  )}
                </Button>

                <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#A89F96', fontSize: '0.75rem' }}>
                    L'accès à la plateforme se fait uniquement sur invitation de l'administration
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="text"
                    onClick={() => navigate('/')}
                    sx={{
                      color: '#636E72',
                      textTransform: 'none',
                      fontSize: '0.85rem',
                      py: 0.5,
                      '&:hover': {
                        background: 'transparent',
                        color: '#FF6B6B',
                      },
                    }}
                  >
                    ← Retour à l'accueil
                  </Button>
                </Box>
              </form>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
