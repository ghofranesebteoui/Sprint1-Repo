import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import config from '../config';

const DemandeAcces = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    type_acteur: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    date_naissance: '',
    cin: '',
    niveau_etude: '',
    specialite: '',
    annee_universitaire: '',
    grade: '',
    specialite_enseignement: '',
    etablissement_souhaite: '',
  });

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
      await axios.post(`${config.API_URL}/demandes-acces/soumettre`, formData);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Une erreur est survenue lors de la soumission de votre demande'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #C8E6C9 0%, #F5F5DC 50%, #FFCCBC 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: '#4ECDC4', mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: '#2D3436' }}>
              Demande envoyée !
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#636E72' }}>
              Votre demande d'accès a été soumise avec succès. L'administration examinera
              votre demande et vous recevrez un email avec vos identifiants si elle est
              acceptée.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                borderRadius: '50px',
                px: 4,
                py: 1.5,
              }}
            >
              Retour à l'accueil
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        background: 'linear-gradient(135deg, #C8E6C9 0%, #F5F5DC 50%, #FFCCBC 100%)',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 1,
              fontWeight: 700,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Demande d'accès
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, textAlign: 'center', color: '#636E72' }}
          >
            Remplissez ce formulaire pour demander l'accès à la plateforme SIAPET
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Type d'acteur"
                  name="type_acteur"
                  value={formData.type_acteur}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="etudiant">Étudiant</MenuItem>
                  <MenuItem value="enseignant">Enseignant</MenuItem>
                  <MenuItem value="directeur">Directeur</MenuItem>
                  <MenuItem value="recteur">Recteur</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date de naissance"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CIN"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                />
              </Grid>

              {formData.type_acteur === 'etudiant' && (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Niveau d'étude"
                      name="niveau_etude"
                      value={formData.niveau_etude}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Spécialité"
                      name="specialite"
                      value={formData.specialite}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Année universitaire"
                      name="annee_universitaire"
                      value={formData.annee_universitaire}
                      onChange={handleChange}
                      placeholder="2025-2026"
                    />
                  </Grid>
                </>
              )}

              {formData.type_acteur === 'enseignant' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Spécialité d'enseignement"
                      name="specialite_enseignement"
                      value={formData.specialite_enseignement}
                      onChange={handleChange}
                    />
                  </Grid>
                </>
              )}

              {(formData.type_acteur === 'directeur' ||
                formData.type_acteur === 'recteur') && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Établissement souhaité"
                    name="etablissement_souhaite"
                    value={formData.etablissement_souhaite}
                    onChange={handleChange}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB088 100%)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Soumettre ma demande'
                  )}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/')}
                  sx={{
                    py: 1.5,
                    borderRadius: '50px',
                    borderColor: '#FF6B6B',
                    color: '#FF6B6B',
                  }}
                >
                  Retour
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default DemandeAcces;
