import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility,
  VisibilityOff,
  PhotoCamera,
} from '@mui/icons-material';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [userData, setUserData] = useState({
    numero_utilisateur: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sexe: '',
    type_utilisateur: '',
    statut: '',
  });

  const [editedData, setEditedData] = useState({});

  const [passwordData, setPasswordData] = useState({
    ancien_mot_de_passe: '',
    nouveau_mot_de_passe: '',
    confirmer_mot_de_passe: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${config.apiUrl}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Construire l'objet userData avec toutes les informations
        const profileData = {
          numero_utilisateur: data.numero_utilisateur,
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone || '',
          sexe: data.sexe || '',
          type_utilisateur: data.type_utilisateur,
          statut: data.statut,
        };

        // Ajouter les informations spécifiques selon le type
        if (data.enseignant) {
          profileData.enseignant = {
            numero_enseignant: data.enseignant.numero_enseignant,
            cin: data.enseignant.cin,
            grade: data.enseignant.grade,
            specialite: data.enseignant.specialite || '',
            annees_experience: data.enseignant.annees_experience || 0,
            departement_nom: data.enseignant.departement_nom,
            departement_id: data.enseignant.departement_id,
            etablissement_nom: data.enseignant.etablissement_nom,
            etablissement_id: data.enseignant.etablissement_id,
          };
        } else if (data.etudiant) {
          profileData.etudiant = {
            numero_etudiant: data.etudiant.numero_etudiant,
            cin: data.etudiant.cin,
            date_naissance: data.etudiant.date_naissance,
            filiere: data.etudiant.filiere || '',
            ville_nom: data.etudiant.ville_nom,
            id_ville: data.etudiant.id_ville,
          };
        }

        setUserData(profileData);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Impossible de charger les données du profil');
      }
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditedData({ ...userData });
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedData({});
    setError('');
  };

  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${config.apiUrl}/api/profile`,
        {
          nom: editedData.nom,
          prenom: editedData.prenom,
          email: editedData.email,
          telephone: editedData.telephone,
          sexe: editedData.sexe,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setUserData(editedData);
        setEditing(false);
        setSuccess('Profil mis à jour avec succès !');
        
        // Mettre à jour le localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
          ...user,
          nom: editedData.nom,
          prenom: editedData.prenom,
          email: editedData.email,
        }));
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.nouveau_mot_de_passe !== passwordData.confirmer_mot_de_passe) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.nouveau_mot_de_passe.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${config.apiUrl}/api/auth/change-password`,
        {
          ancien_mot_de_passe: passwordData.ancien_mot_de_passe,
          nouveau_mot_de_passe: passwordData.nouveau_mot_de_passe,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setSuccess('Mot de passe modifié avec succès !');
        setChangingPassword(false);
        setPasswordData({
          ancien_mot_de_passe: '',
          nouveau_mot_de_passe: '',
          confirmer_mot_de_passe: '',
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    const roles = {
      'ADMIN_MESRS': 'Administrateur MESRS',
      'RECTEUR': 'Recteur d\'Université',
      'DIRECTEUR': 'Directeur d\'Établissement',
      'ENSEIGNANT': 'Enseignant',
      'ETUDIANT': 'Étudiant',
    };
    return roles[role] || role;
  };

  if (loading && !editing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Crimson Pro", serif',
            fontWeight: 700,
            color: '#2D3436',
            mb: 0.5,
          }}
        >
          Mon Profil
        </Typography>
        <Typography variant="body1" sx={{ color: '#636E72' }}>
          Gérez vos informations personnelles et votre mot de passe
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Informations du profil */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Informations personnelles
                </Typography>
                {!editing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF9A77 0%, #FF5A5A 100%)',
                      },
                    }}
                  >
                    Modifier
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      sx={{ textTransform: 'none' }}
                    >
                      Annuler
                    </Button>
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      variant="contained"
                      disabled={loading}
                      sx={{
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                      }}
                    >
                      Enregistrer
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="prenom"
                    value={editing ? editedData.prenom : userData.prenom}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="nom"
                    value={editing ? editedData.nom : userData.nom}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={editing ? editedData.email : userData.email}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Téléphone"
                    name="telephone"
                    value={editing ? editedData.telephone : userData.telephone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Sexe"
                    name="sexe"
                    value={editing ? editedData.sexe : userData.sexe}
                    onChange={handleChange}
                    disabled={!editing}
                    SelectProps={{ native: true }}
                  >
                    <option value="HOMME">Homme</option>
                    <option value="FEMME">Femme</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Matricule"
                    value={userData.numero_utilisateur}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rôle"
                    value={getRoleLabel(userData.type_utilisateur)}
                    disabled
                  />
                </Grid>

                {/* Informations spécifiques Enseignant */}
                {userData.enseignant && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Informations Professionnelles" />
                      </Divider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CIN"
                        value={userData.enseignant.cin || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Grade"
                        value={userData.enseignant.grade || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Spécialité"
                        value={userData.enseignant.specialite || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Années d'expérience"
                        value={userData.enseignant.annees_experience || 0}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Établissement"
                        value={userData.enseignant.etablissement_nom || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Département"
                        value={userData.enseignant.departement_nom || ''}
                        disabled
                      />
                    </Grid>
                  </>
                )}

                {/* Informations spécifiques Étudiant */}
                {userData.etudiant && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Informations Académiques" />
                      </Divider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CIN"
                        value={userData.etudiant.cin || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date de naissance"
                        value={userData.etudiant.date_naissance ? new Date(userData.etudiant.date_naissance).toLocaleDateString('fr-FR') : ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Filière"
                        value={userData.etudiant.filiere || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Ville"
                        value={userData.etudiant.ville_nom || ''}
                        disabled
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Photo de profil */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Photo de profil
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 150,
                    height: 150,
                    fontSize: '3rem',
                    background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                  }}
                >
                  {userData.prenom?.[0]}{userData.nom?.[0]}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: 'white',
                    boxShadow: 2,
                    '&:hover': { background: '#f5f5f5' },
                  }}
                  component="label"
                >
                  <PhotoCamera />
                  <input type="file" hidden accept="image/*" />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Formats acceptés: JPG, PNG
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taille max: 2 MB
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Statut du compte
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: userData.statut === 'ACTIF' ? '#4CAF50' : '#F44336',
                  }}
                />
                <Typography variant="body2">
                  {userData.statut === 'ACTIF' ? 'Compte actif' : 'Compte inactif'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Changement de mot de passe */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Sécurité
                </Typography>
                {!changingPassword && (
                  <Button
                    onClick={() => setChangingPassword(true)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Changer le mot de passe
                  </Button>
                )}
              </Box>

              {changingPassword ? (
                <form onSubmit={handlePasswordSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Ancien mot de passe"
                        name="ancien_mot_de_passe"
                        type={showOldPassword ? 'text' : 'password'}
                        value={passwordData.ancien_mot_de_passe}
                        onChange={handlePasswordChange}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                edge="end"
                              >
                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nouveau mot de passe"
                        name="nouveau_mot_de_passe"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.nouveau_mot_de_passe}
                        onChange={handlePasswordChange}
                        required
                        helperText="Minimum 8 caractères"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                edge="end"
                              >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirmer le mot de passe"
                        name="confirmer_mot_de_passe"
                        type="password"
                        value={passwordData.confirmer_mot_de_passe}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          onClick={() => {
                            setChangingPassword(false);
                            setPasswordData({
                              ancien_mot_de_passe: '',
                              nouveau_mot_de_passe: '',
                              confirmer_mot_de_passe: '',
                            });
                            setError('');
                          }}
                          sx={{ textTransform: 'none' }}
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          sx={{
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #FFB088 0%, #FF6B6B 100%)',
                          }}
                        >
                          {loading ? 'Modification...' : 'Modifier le mot de passe'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Dernière modification : Il y a 30 jours
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
