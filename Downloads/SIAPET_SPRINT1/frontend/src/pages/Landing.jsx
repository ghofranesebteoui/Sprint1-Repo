import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  School,
  TrendingUp,
  Security,
  Speed,
  Analytics,
  Groups,
} from '@mui/icons-material';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '👨‍💼',
      title: 'Administrateurs',
      description: 'Vue d\'ensemble nationale, KPIs en temps réel, carte géographique interactive, identification des établissements à risque et génération automatique de rapports.',
      color: '#FF6B6B',
    },
    {
      icon: '🎓',
      title: 'Recteurs',
      description: 'Gestion universitaire complète, supervision des établissements, allocation budgétaire, statistiques globales et rapports stratégiques pour l\'université.',
      color: '#4ECDC4',
    },
    {
      icon: '🏛️',
      title: 'Directeurs',
      description: 'Tableau de bord personnalisé, analyse comparative par filière, système d\'alertes intelligent et suivi des performances de votre établissement.',
      color: '#FFB088',
    },
    {
      icon: '👨‍🏫',
      title: 'Enseignants',
      description: 'Statistiques détaillées par classe, identification des étudiants à risque, recommandations pédagogiques IA et outils d\'analyse des performances.',
      color: '#C7CEEA',
    },
    {
      icon: '👨‍🎓',
      title: 'Étudiants',
      description: 'Suivi personnalisé de progression, radar des compétences, recommandations d\'apprentissage et accès aux ressources de renforcement.',
      color: '#95E1D3',
    },
    {
      icon: '📊',
      title: 'Analytics Avancés',
      description: 'Visualisations interactives, tendances temporelles, analyses comparatives et exports de données personnalisables pour tous les acteurs.',
      color: '#B8B8FF',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Étudiants' },
    { value: '150+', label: 'Établissements' },
    { value: '95%', label: 'Satisfaction' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <Box sx={{ overflow: 'hidden', background: '#FFFFFF' }}>
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 1px 3px rgba(255, 107, 107, 0.1)',
          borderBottom: '1px solid rgba(255, 107, 107, 0.1)',
          py: 1,
        }}
      >
        <Toolbar sx={{ minHeight: '80px' }}>
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              fontSize: '2rem',
            }}
          >
            SIAPET
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <Typography
              sx={{
                color: '#2D3436',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '1.1rem',
                position: 'relative',
                '&:hover': { color: '#FF6B6B' },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease',
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                },
              }}
            >
              Accueil
            </Typography>
            <Typography
              sx={{
                color: '#2D3436',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '1.1rem',
                position: 'relative',
                '&:hover': { color: '#FF6B6B' },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease',
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                },
              }}
            >
              Fonctionnalités
            </Typography>
            <Typography
              sx={{
                color: '#2D3436',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '1.1rem',
                position: 'relative',
                '&:hover': { color: '#FF6B6B' },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease',
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                },
              }}
            >
              À propos
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              Commencer
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          pt: 12,
          pb: 4,
          background: 'linear-gradient(135deg, #C8E6C9 0%, #F5F5DC 50%, #FFCCBC 100%)',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                mb: 3,
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.08)',
              }}
            >
              <Typography
                sx={{
                  background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                ✨ Éducation • Analyse Prédictive • Intelligence Artificielle
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontFamily: '"Crimson Pro", serif',
                fontSize: { xs: '2.5rem', md: '5rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 2,
                background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              L'avenir de l'analyse
              <br />
              éducative commence ici
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: '#636E72',
                mb: 4,
                fontWeight: 400,
                fontSize: { xs: '1.15rem', md: '1.5rem' },
              }}
            >
              <strong>SIAPET</strong> : plateforme intelligente pour l'analyse des performances éducatives en tunisie
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.05rem',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                  boxShadow: '0 8px 24px rgba(255, 107, 107, 0.3)',
                }}
              >
                Se connecter →
              </Button>
            </Box>
            
            <Typography
              variant="body2"
              sx={{
                mt: 3,
                color: '#A89F96',
                fontSize: '0.9rem',
                textAlign: 'center',
              }}
            >
              L'accès à la plateforme se fait uniquement sur invitation de l'administration
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6, background: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE5CC 100%)',
                color: '#FF6B6B',
                padding: '0.5rem 1.25rem',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '0.85rem',
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Fonctionnalités
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Crimson Pro", serif',
                fontSize: '3rem',
                fontWeight: 700,
                mb: 2,
                color: '#2D3436',
              }}
            >
              Une plateforme complète pour tous les acteurs
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#636E72',
                fontSize: '1.15rem',
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              Des outils puissants adaptés à chaque rôle dans l'écosystème éducatif
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE5CC 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                      transform: 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                    },
                    '&:hover::before': {
                      transform: 'scaleX(1)',
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(255, 107, 107, 0.16)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        mb: 2,
                        boxShadow: '0 8px 24px rgba(255, 107, 107, 0.3)',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ mb: 1.5, fontWeight: 700, color: '#2D3436' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#636E72', lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, background: '#FFF4E6' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h2"
                    sx={{
                      background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 900,
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Divider */}
      <Box sx={{ py: 4, background: '#FFFFFF' }} />

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #FFE5CC 0%, #FFCCBC 100%)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Crimson Pro", serif',
                color: '#2D3436',
                mb: 3,
                fontWeight: 900,
              }}
            >
              Rejoignez SIAPET
            </Typography>
            <Typography variant="h6" sx={{ color: '#636E72', mb: 3 }}>
              Rejoignez des milliers d'établissements qui utilisent SIAPET pour améliorer
              leurs performances éducatives
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                boxShadow: '0 8px 24px rgba(255, 107, 107, 0.3)',
              }}
            >
              Accéder à la plateforme
            </Button>
            <Typography
              variant="body2"
              sx={{
                mt: 3,
                color: '#A89F96',
                fontSize: '0.9rem',
              }}
            >
              Accès réservé aux membres invités par l'administration
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                SIAPET
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Système Intelligent d'Analyse Prédictive des Performances Éducatives
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Transformez vos données éducatives en insights actionnables.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Plateforme
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
                >
                  Accueil
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
                >
                  Fonctionnalités
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
                >
                  À propos
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Ressources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
                >
                  Documentation
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
                >
                  Support
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
                >
                  FAQ
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Légal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
                >
                  Confidentialité
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
                >
                  Conditions
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
                >
                  Mentions légales
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  contact@siapet.tn
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +216 XX XXX XXX
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2026 SIAPET - Tous droits réservés
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
              >
                Politique de confidentialité
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }}
              >
                Conditions d'utilisation
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
