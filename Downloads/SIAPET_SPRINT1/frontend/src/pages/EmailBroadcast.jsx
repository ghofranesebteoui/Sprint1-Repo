import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import {
  Send,
  Email,
  Group,
  Preview,
  Clear,
} from '@mui/icons-material';
import api from '../services/api';

const EmailBroadcast = () => {
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    roles: [],
    regions: [],
    villes: [],
    etablissements: [],
    universites: [],
  });
  
  // États pour contrôler l'ouverture des menus
  const [openMenus, setOpenMenus] = useState({
    roles: false,
    regions: false,
    villes: false,
    etablissements: false,
    universites: false,
  });
  
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    recipients: {
      roles: [],
      regions: [],
      villes: [],
      etablissements: [],
      universites: [],
      statut: 'ACTIF', // Par défaut, envoyer uniquement aux utilisateurs actifs
    },
  });

  const [recipientCount, setRecipientCount] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    // Mettre à jour le nombre de destinataires quand les filtres changent
    if (hasFilters()) {
      fetchRecipientCount();
    } else {
      setRecipientCount(0);
    }
  }, [emailData.recipients]);

  const fetchFilterOptions = async () => {
    try {
      const response = await api.get('/users/filter-options');
      setFilterOptions({
        roles: response.data.roles || [],
        regions: response.data.regions || [],
        villes: response.data.villes || [],
        etablissements: response.data.etablissements || [],
        universites: response.data.universites || [],
      });
    } catch (error) {
      console.error('Erreur lors du chargement des options:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des options',
        severity: 'error',
      });
    }
  };

  const hasFilters = () => {
    const { roles, regions, villes, etablissements, universites } = emailData.recipients;
    return roles.length > 0 || regions.length > 0 || villes.length > 0 || 
           etablissements.length > 0 || universites.length > 0;
  };

  const fetchRecipientCount = async () => {
    setPreviewLoading(true);
    try {
      console.log('Envoi de la requête preview avec:', emailData.recipients);
      const response = await api.post('/emails/preview-recipients', emailData.recipients);
      console.log('Réponse preview:', response.data);
      setRecipientCount(response.data.count);
    } catch (error) {
      console.error('Erreur lors du comptage des destinataires:', error);
      console.error('Détails:', error.response?.data);
      setSnackbar({
        open: true,
        message: `Erreur: ${error.response?.data?.message || error.message}`,
        severity: 'error',
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleRecipientChange = (field, value) => {
    setEmailData((prev) => ({
      ...prev,
      recipients: {
        ...prev.recipients,
        [field]: value,
      },
    }));
    // Fermer le menu après la sélection
    setOpenMenus((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleSendEmail = async () => {
    // Validation
    if (!emailData.subject.trim()) {
      setSnackbar({
        open: true,
        message: 'Veuillez saisir un objet pour l\'email',
        severity: 'error',
      });
      return;
    }

    if (!emailData.message.trim()) {
      setSnackbar({
        open: true,
        message: 'Veuillez saisir un message',
        severity: 'error',
      });
      return;
    }

    if (!hasFilters()) {
      setSnackbar({
        open: true,
        message: 'Veuillez sélectionner au moins un critère de destinataires',
        severity: 'error',
      });
      return;
    }

    if (recipientCount === 0) {
      setSnackbar({
        open: true,
        message: 'Aucun destinataire trouvé avec ces critères',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/emails/broadcast', emailData);
      setSnackbar({
        open: true,
        message: `Email envoyé avec succès à ${response.data.sent} destinataire(s)`,
        severity: 'success',
      });
      
      // Réinitialiser le formulaire
      setEmailData({
        subject: '',
        message: '',
        recipients: {
          roles: [],
          regions: [],
          villes: [],
          etablissements: [],
          universites: [],
          statut: 'ACTIF',
        },
      });
      setRecipientCount(0);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmailData({
      subject: '',
      message: '',
      recipients: {
        roles: [],
        regions: [],
        villes: [],
        etablissements: [],
        universites: [],
        statut: 'ACTIF',
      },
    });
    setRecipientCount(0);
  };

  return (
    <Box>
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
          📧 Diffusion d'emails
        </Typography>
        <Typography variant="body1" sx={{ color: '#636E72', fontSize: '1.05rem' }}>
          Envoyer des emails groupés aux utilisateurs selon des critères spécifiques
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sélection des destinataires */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Group sx={{ mr: 1, color: '#FF6B6B', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Destinataires
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Rôles</InputLabel>
                    <Select
                      multiple
                      open={openMenus.roles}
                      onOpen={() => setOpenMenus((prev) => ({ ...prev, roles: true }))}
                      onClose={() => setOpenMenus((prev) => ({ ...prev, roles: false }))}
                      value={emailData.recipients.roles}
                      label="Rôles"
                      onChange={(e) => handleRecipientChange('roles', e.target.value)}
                      MenuProps={{
                        autoFocus: false,
                        disableAutoFocusItem: true,
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={filterOptions.roles.find((r) => r.value === value)?.label}
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                      sx={{ borderRadius: 2 }}
                    >
                      {filterOptions.roles.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Régions</InputLabel>
                    <Select
                      multiple
                      open={openMenus.regions}
                      onOpen={() => setOpenMenus((prev) => ({ ...prev, regions: true }))}
                      onClose={() => setOpenMenus((prev) => ({ ...prev, regions: false }))}
                      value={emailData.recipients.regions}
                      label="Régions"
                      onChange={(e) => handleRecipientChange('regions', e.target.value)}
                      MenuProps={{
                        autoFocus: false,
                        disableAutoFocusItem: true,
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={filterOptions.regions.find((r) => r.id_region === value)?.nom_region}
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                      sx={{ borderRadius: 2 }}
                    >
                      {filterOptions.regions.map((region) => (
                        <MenuItem key={region.id_region} value={region.id_region}>
                          {region.nom_region}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Villes</InputLabel>
                    <Select
                      multiple
                      open={openMenus.villes}
                      onOpen={() => setOpenMenus((prev) => ({ ...prev, villes: true }))}
                      onClose={() => setOpenMenus((prev) => ({ ...prev, villes: false }))}
                      value={emailData.recipients.villes}
                      label="Villes"
                      onChange={(e) => handleRecipientChange('villes', e.target.value)}
                      MenuProps={{
                        autoFocus: false,
                        disableAutoFocusItem: true,
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={filterOptions.villes.find((v) => v.id_ville === value)?.nom_ville}
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                      sx={{ borderRadius: 2 }}
                    >
                      {filterOptions.villes.map((ville) => (
                        <MenuItem key={ville.id_ville} value={ville.id_ville}>
                          {ville.nom_ville}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Universités</InputLabel>
                    <Select
                      multiple
                      open={openMenus.universites}
                      onOpen={() => setOpenMenus((prev) => ({ ...prev, universites: true }))}
                      onClose={() => setOpenMenus((prev) => ({ ...prev, universites: false }))}
                      value={emailData.recipients.universites}
                      label="Universités"
                      onChange={(e) => handleRecipientChange('universites', e.target.value)}
                      MenuProps={{
                        autoFocus: false,
                        disableAutoFocusItem: true,
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={filterOptions.universites.find((u) => u.id_rectorat === value)?.nom_rectorat}
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                      sx={{ borderRadius: 2 }}
                    >
                      {filterOptions.universites.map((univ) => (
                        <MenuItem key={univ.id_rectorat} value={univ.id_rectorat}>
                          {univ.nom_rectorat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Établissements</InputLabel>
                    <Select
                      multiple
                      open={openMenus.etablissements}
                      onOpen={() => setOpenMenus((prev) => ({ ...prev, etablissements: true }))}
                      onClose={() => setOpenMenus((prev) => ({ ...prev, etablissements: false }))}
                      value={emailData.recipients.etablissements}
                      label="Établissements"
                      onChange={(e) => handleRecipientChange('etablissements', e.target.value)}
                      MenuProps={{
                        autoFocus: false,
                        disableAutoFocusItem: true,
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={filterOptions.etablissements.find((e) => e.id_etablissement === value)?.nom_etablissement}
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                      sx={{ borderRadius: 2 }}
                    >
                      {filterOptions.etablissements.map((etab) => (
                        <MenuItem key={etab.id_etablissement} value={etab.id_etablissement}>
                          {etab.nom_etablissement}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Statut</InputLabel>
                    <Select
                      value={emailData.recipients.statut}
                      label="Statut"
                      onChange={(e) => handleRecipientChange('statut', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Tous les statuts</MenuItem>
                      <MenuItem value="ACTIF">Actifs uniquement</MenuItem>
                      <MenuItem value="INACTIF">Inactifs uniquement</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Paper
                sx={{
                  p: 2,
                  background: '#FFF4E6',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: '#636E72', display: 'block', mb: 1 }}>
                  Nombre de destinataires
                </Typography>
                {previewLoading ? (
                  <CircularProgress size={24} sx={{ color: '#FF6B6B' }} />
                ) : (
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF6B6B' }}>
                    {recipientCount}
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Composition de l'email */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Email sx={{ mr: 1, color: '#FF6B6B', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Composition du message
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Objet de l'email"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    placeholder="Ex: Nouvelle fonctionnalité disponible"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    label="Message"
                    value={emailData.message}
                    onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                    placeholder="Rédigez votre message ici..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#636E72', mt: 1, display: 'block' }}>
                    {emailData.message.length} caractères
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    L'email sera envoyé depuis l'adresse système et inclura automatiquement
                    le nom du destinataire dans la salutation.
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      startIcon={<Clear />}
                      onClick={handleClear}
                      sx={{
                        color: '#636E72',
                        textTransform: 'none',
                        '&:hover': { background: '#F5F5F5' },
                      }}
                    >
                      Réinitialiser
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                      onClick={handleSendEmail}
                      disabled={loading || recipientCount === 0}
                      sx={{
                        background: '#FF6B6B',
                        textTransform: 'none',
                        px: 4,
                        '&:hover': { background: '#FF5252' },
                      }}
                    >
                      {loading ? 'Envoi en cours...' : `Envoyer à ${recipientCount} destinataire(s)`}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailBroadcast;
