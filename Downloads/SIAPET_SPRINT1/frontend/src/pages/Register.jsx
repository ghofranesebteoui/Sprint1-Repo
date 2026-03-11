import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  MenuItem,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  School as SchoolIcon,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'etudiant',
    etablissement: '',
    acceptTerms: false,
  });

  const roles = [
    { value: 'etudiant', label: 'Étudiant' },
    { value: 'enseignant', label: 'Enseignant' },
    { value: 'directeur', label: 'Directeur de faculté' },
    { value: 'recteur', label: 'Recteur d\'université' },
    { value: 'admin', label: 'Administrateur' },
  ];

  const etablissements = [
    'Université Paris-Saclay',
    'IUT Lyon 1',
    'Université de Lille',
    'École Centrale Marseille',
    'IUT Toulouse',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1500);
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              textAlign: 'center',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: '#10B981', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Inscription Réussie !
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Votre compte a été créé avec succès. Vous allez être redirigé vers la page de
              connexion...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Side - Visual */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #FFB088 0%, #FF8A80 50%, #FF6B6B 100%)',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          color: 'white',
        }}
      >
        <Box sx={{ maxWidth: 500 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Crimson Pro", serif',
              fontSize: '3rem',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Bienvenue sur SIAPET !
          </Typography>
          <Typography sx={{ fontSize: '1.15rem', opacity: 0.95, lineHeight: 1.8, mb: 3 }}>
            Rejoignez notre plateforme d'analyse prédictive des performances éducatives. Bénéficiez d'outils avancés de suivi, d'analyse et de recommandations personnalisées.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography>✨ Analyse prédictive par intelligence artificielle</Typography>
            <Typography>📊 Tableaux de bord analytiques en temps réel</Typography>
            <Typography>🎯 Suivi personnalisé des performances</Typography>
            <Typography>📈 Recommandations stratégiques adaptées</Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: '#FFFFFF',
        }}
      >
        <Container maxWidth="sm">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{
              color: '#2D3436',
              mb: 3,
              '&:hover': {
                background: '#FFF4E6',
              },
            }}
          >
            Retour à l'accueil
          </Button>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Crimson Pro", serif',
                fontWeight: 700,
                mb: 1,
                color: '#2D3436',
              }}
            >
              Inscription
            </Typography>
            <Typography sx={{ color: '#636E72', fontSize: '1.05rem' }}>
              Inscription à SIAPET
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '0.95rem' }}>
                  Prénom
                </Typography>
                <TextField
                  fullWidth
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jean"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '0.95rem' }}>
                  Nom
                </Typography>
                <TextField
                  fullWidth
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Dupont"
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '0.95rem' }}>
                Adresse email
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean.dupont@universite.fr"
                required
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '0.95rem' }}>
                Rôle
              </Typography>
              <TextField
                fullWidth
                select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '0.95rem' }}>
                Établissement
              </Typography>
              <TextField
                fullWidth
                name="etablissement"
                value={formData.etablissement}
                onChange={handleChange}
                placeholder="Université de Tunis / FSB / FSEG..."
                required
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '0.95rem' }}>
                Mot de passe
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '0.95rem' }}>
                Confirmer le mot de passe
              </Typography>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  sx={{ color: '#FF6B6B' }}
                />
              }
              label={
                <Typography variant="body2">
                  J'accepte les{' '}
                  <Link to="/terms" style={{ color: '#FF6B6B', fontWeight: 600 }}>
                    conditions d'utilisation
                  </Link>
                </Typography>
              }
              sx={{ mt: 2, mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                boxShadow: '0 8px 24px rgba(255, 107, 107, 0.3)',
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Créer mon compte →'
              )}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login"
                style={{
                  color: '#FF6B6B',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Se connecter
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;
