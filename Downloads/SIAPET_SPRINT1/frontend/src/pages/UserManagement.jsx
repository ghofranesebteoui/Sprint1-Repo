import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  Snackbar,
  TablePagination,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Block,
  CheckCircle,
  Clear,
  ArrowBack,
  Email,
  Phone,
  LocationOn,
  School,
  CalendarToday,
} from '@mui/icons-material';
import api from '../services/api';

const UserManagement = () => {
  const { userType } = useParams(); // Récupérer le type d'utilisateur depuis l'URL
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    role: userType ? userType.toUpperCase() : '', // Pré-remplir avec le type d'utilisateur
    statut: '',
    region: '',
    ville: '',
    etablissement: '',
    universite: '',
  });
  const [filterOptions, setFilterOptions] = useState({
    roles: [],
    statuts: [],
    regions: [],
    villes: [],
    etablissements: [],
    universites: [],
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Mettre à jour le filtre de rôle quand userType change
  useEffect(() => {
    if (userType) {
      setFilters((prev) => ({ ...prev, role: userType.toUpperCase() }));
    }
  }, [userType]);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await api.get('/users/filter-options');
      setFilterOptions({
        roles: response.data.roles || [],
        statuts: response.data.statuts || [],
        regions: response.data.regions || [],
        villes: response.data.villes || [],
        etablissements: response.data.etablissements || [],
        universites: response.data.universites || [],
      });
    } catch (error) {
      console.error('Erreur lors du chargement des options:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Nettoyer les filtres vides
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          // Pour les chaînes, trim, pour les nombres, garder tel quel
          acc[key] = typeof value === 'string' ? value.trim() : value;
        }
        return acc;
      }, {});

      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...cleanFilters,
      };

      console.log('Envoi des paramètres:', params);

      const response = await api.get('/users', { params });
      setUsers(response.data.users || []);
      setTotal(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des utilisateurs',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'ACTIF':
        return { bg: '#E8FAF0', color: '#22C55E' };
      case 'INACTIF':
        return { bg: '#FFF0DC', color: '#F5A623' };
      case 'SUSPENDU':
        return { bg: '#FFF0EC', color: '#FF6B47' };
      default:
        return { bg: '#EFF6FF', color: '#64748B' };
    }
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      ADMIN_MESRS: 'Admin',
      RECTEUR: 'Recteur',
      DIRECTEUR: 'Directeur',
      ENSEIGNANT: 'Enseignant',
      ETUDIANT: 'Étudiant',
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      ADMIN_MESRS: '#2575E8',
      RECTEUR: '#529BF5',
      DIRECTEUR: '#2DC9B4',
      ENSEIGNANT: '#FF9A3C',
      ETUDIANT: '#A78BFA',
    };
    return colorMap[role] || '#64748B';
  };

  const getUserTypeTitle = () => {
    if (!userType) return 'Tous les utilisateurs';
    const roleMap = {
      recteur: 'Recteurs',
      directeur: 'Directeurs',
      enseignant: 'Enseignants',
      etudiant: 'Étudiants',
    };
    return roleMap[userType.toLowerCase()] || 'Utilisateurs';
  };

  const getUserTypeIcon = () => {
    return '👨‍💼';
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleToggleStatus = async (user) => {
    try {
      await api.patch(`/users/${user.numero_utilisateur}/toggle-status`);
      setSnackbar({
        open: true,
        message: `Statut de ${user.nom} ${user.prenom} modifié avec succès`,
        severity: 'success',
      });
      fetchUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la modification du statut',
        severity: 'error',
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      role: '',
      statut: '',
      region: '',
      ville: '',
      etablissement: '',
      universite: '',
    });
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FBFF 100%)',
          borderRadius: '20px',
          p: 3.5,
          boxShadow: '0 2px 12px rgba(37, 117, 232, 0.08)',
          border: '1px solid #E8EEF7',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <IconButton
            onClick={handleGoBack}
            sx={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #2575E8 0%, #1050B0 100%)',
              boxShadow: '0 4px 14px rgba(37, 117, 232, 0.3)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #1A62D4 0%, #0D3D8F 100%)',
                transform: 'translateX(-4px)',
                boxShadow: '0 6px 20px rgba(37, 117, 232, 0.45)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowBack sx={{ color: '#FFFFFF', fontSize: 22 }} />
          </IconButton>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 800,
                color: '#0C1B3E',
                mb: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                fontSize: '28px',
                letterSpacing: '-0.5px',
              }}
            >
              <Box
                sx={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2575E8 0%, #1050B0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                {getUserTypeIcon()}
              </Box>
              Gestion des {getUserTypeTitle()}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', fontSize: '14px', fontWeight: 500, fontFamily: '"Nunito Sans", sans-serif', ml: '58px' }}>
              Gérer et filtrer {userType ? `les ${getUserTypeTitle().toLowerCase()}` : 'tous les utilisateurs du système'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterList sx={{ mr: 1, color: '#2575E8', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', fontFamily: '"Nunito", sans-serif' }}>
                Filtres
              </Typography>
            </Box>
            <Button
              startIcon={<Clear />}
              onClick={handleResetFilters}
              size="small"
              sx={{
                color: '#64748B',
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                '&:hover': { background: '#EFF6FF' },
              }}
            >
              Réinitialiser
            </Button>
          </Box>

          <Grid container spacing={1.5}>
            {/* Filtres simplifiés pour directeurs, recteurs, enseignants */}
            {userType && ['directeur', 'recteur', 'enseignant'].includes(userType.toLowerCase()) ? (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Rechercher par nom, prénom, email ou téléphone..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Statut</InputLabel>
                    <Select
                      value={filters.statut}
                      label="Statut"
                      onChange={(e) => handleFilterChange('statut', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Tous les statuts</MenuItem>
                      {filterOptions.statuts.map((statut) => (
                        <MenuItem key={statut.value} value={statut.value}>
                          {statut.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            ) : (
              /* Filtres complets pour étudiants et vue générale */
              <>
                <Grid item xs={12} md={userType ? 6 : 4}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Rechercher par nom, prénom, email ou téléphone..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                {!userType && (
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Rôle</InputLabel>
                      <Select
                        value={filters.role}
                        label="Rôle"
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">Tous les rôles</MenuItem>
                        {filterOptions.roles.map((role) => (
                          <MenuItem key={role.value} value={role.value}>
                            {role.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12} md={userType ? 6 : 4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Statut</InputLabel>
                    <Select
                      value={filters.statut}
                      label="Statut"
                      onChange={(e) => handleFilterChange('statut', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Tous les statuts</MenuItem>
                      {filterOptions.statuts.map((statut) => (
                        <MenuItem key={statut.value} value={statut.value}>
                          {statut.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Région</InputLabel>
                    <Select
                      value={filters.region}
                      label="Région"
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Toutes les régions</MenuItem>
                      {filterOptions.regions.map((region) => (
                        <MenuItem key={region.id_region} value={region.id_region}>
                          {region.nom_region}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Ville</InputLabel>
                    <Select
                      value={filters.ville}
                      label="Ville"
                      onChange={(e) => handleFilterChange('ville', e.target.value)}
                      sx={{ borderRadius: 2 }}
                      disabled={!filters.region}
                    >
                      <MenuItem value="">Toutes les villes</MenuItem>
                      {filterOptions.villes
                        .filter((v) => !filters.region || v.id_region == filters.region)
                        .map((ville) => (
                          <MenuItem key={ville.id_ville} value={ville.id_ville}>
                            {ville.nom_ville}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Université</InputLabel>
                    <Select
                      value={filters.universite}
                      label="Université"
                      onChange={(e) => handleFilterChange('universite', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Toutes les universités</MenuItem>
                      {filterOptions.universites.map((univ) => (
                        <MenuItem key={univ.id_rectorat} value={univ.id_rectorat}>
                          {univ.nom_rectorat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Établissement</InputLabel>
                    <Select
                      value={filters.etablissement}
                      label="Établissement"
                      onChange={(e) => handleFilterChange('etablissement', e.target.value)}
                      sx={{ borderRadius: 2 }}
                      disabled={!filters.universite}
                    >
                      <MenuItem value="">Tous les établissements</MenuItem>
                      {filterOptions.etablissements
                        .filter((e) => !filters.universite || e.id_rectorat == filters.universite)
                        .map((etab) => (
                          <MenuItem key={etab.id_etablissement} value={etab.id_etablissement}>
                            {etab.nom_etablissement}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Liste des utilisateurs ({total})
        </Typography>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[6, 12, 24, 48]}
          labelRowsPerPage="Par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          sx={{
            '.MuiTablePagination-toolbar': { minHeight: '48px' },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
            },
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#2575E8' }} />
        </Box>
      ) : users.length === 0 ? (
        <Card sx={{ borderRadius: 3, p: 6, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" color="textSecondary">
            Aucun utilisateur trouvé
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {users.map((user) => {
            const statusStyle = getStatusColor(user.statut);
            const roleColor = getRoleColor(user.type_utilisateur);
            return (
              <Grid item xs={12} sm={6} md={4} key={user.numero_utilisateur}>
                <Card
                  sx={{
                    borderRadius: '16px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '2px solid #2575E8',
                    background: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(37, 117, 232, 0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(37, 117, 232, 0.2)',
                      transform: 'translateY(-4px)',
                      borderColor: '#1050B0',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header avec avatar, nom et statut */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #2575E8 0%, #1050B0 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#FFF',
                          letterSpacing: '1px',
                          fontFamily: '"Nunito", sans-serif',
                          flexShrink: 0,
                        }}
                      >
                        {user.nom?.charAt(0)}{user.prenom?.charAt(0)}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1.05rem',
                            color: '#0C1B3E',
                            lineHeight: 1.3,
                            fontFamily: '"Nunito", sans-serif',
                            mb: 0.5,
                          }}
                        >
                          {user.nom} {user.prenom}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <School sx={{ fontSize: 14, color: '#9DB8D8' }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#64748B',
                              fontSize: '0.8rem',
                              fontFamily: '"Nunito Sans", sans-serif',
                            }}
                          >
                            {getRoleLabel(user.type_utilisateur)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={user.statut}
                        size="small"
                        sx={{
                          ...statusStyle,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: '24px',
                        }}
                      />
                    </Box>

                    {/* Informations de contact */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Email sx={{ fontSize: 16, color: '#C8DCFF' }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.8rem',
                            color: '#5D7AAA',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: '"Nunito Sans", sans-serif',
                            flex: 1,
                          }}
                          title={user.email}
                        >
                          {user.email}
                        </Typography>
                      </Box>

                      {user.telephone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Phone sx={{ fontSize: 16, color: '#C8DCFF' }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '0.8rem', 
                              color: '#5D7AAA', 
                              fontFamily: '"Nunito Sans", sans-serif',
                            }}
                          >
                            {user.telephone}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Spécialités */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <Box sx={{ 
                          width: 4, 
                          height: 4, 
                          borderRadius: '50%', 
                          background: '#FF9A3C' 
                        }} />
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#FF9A3C',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontFamily: '"Nunito Sans", sans-serif',
                          }}
                        >
                          SPÉCIALITÉS
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label="Data Science"
                          size="small"
                          sx={{
                            background: '#FFF0DC',
                            color: '#FF9A3C',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: '24px',
                            fontFamily: '"Nunito Sans", sans-serif',
                          }}
                        />
                        <Chip
                          label={getRoleLabel(user.type_utilisateur)}
                          size="small"
                          sx={{
                            background: '#FFF0DC',
                            color: '#FF9A3C',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: '24px',
                            fontFamily: '"Nunito Sans", sans-serif',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Compétences */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <Box sx={{ 
                          width: 4, 
                          height: 4, 
                          borderRadius: '50%', 
                          background: '#A78BFA' 
                        }} />
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#A78BFA',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontFamily: '"Nunito Sans", sans-serif',
                          }}
                        >
                          COMPÉTENCES
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label="React"
                          size="small"
                          sx={{
                            background: '#F3F0FF',
                            color: '#A78BFA',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: '24px',
                            fontFamily: '"Nunito Sans", sans-serif',
                          }}
                        />
                        <Chip
                          label="Node.js"
                          size="small"
                          sx={{
                            background: '#F3F0FF',
                            color: '#A78BFA',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: '24px',
                            fontFamily: '"Nunito Sans", sans-serif',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Capacité d'encadrement */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#64748B',
                          fontSize: '0.75rem',
                          fontFamily: '"Nunito Sans", sans-serif',
                        }}
                      >
                        Capacité d'encadrement
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#2575E8',
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            fontFamily: '"Nunito", sans-serif',
                          }}
                        >
                          0/3
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1 }} />

                    {/* Actions */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1.5,
                        pt: 2,
                        borderTop: '1px solid #E8EEF7',
                      }}
                    >
                      <Tooltip title="Modifier" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(user)}
                          sx={{
                            color: '#64748B',
                            width: 36,
                            height: 36,
                            '&:hover': { 
                              background: '#EFF6FF',
                              color: '#2575E8',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Visibility sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(user)}
                          sx={{
                            color: '#64748B',
                            width: 36,
                            height: 36,
                            '&:hover': { 
                              background: '#FFF0EC',
                              color: '#FF6B47',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Block sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Dialog détails utilisateur */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '18px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', fontWeight: 700, fontFamily: '"Nunito", sans-serif', color: '#0C1B3E', borderBottom: '1px solid #E8EEF7' }}>
          Détails de l'utilisateur
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#636E72' }}>
                  Nom complet
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedUser.nom} {selectedUser.prenom}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#636E72' }}>
                  Email
                </Typography>
                <Typography variant="body1">{selectedUser.email}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#636E72' }}>
                  Téléphone
                </Typography>
                <Typography variant="body1">{selectedUser.telephone || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#636E72' }}>
                  Rôle
                </Typography>
                <Typography variant="body1">
                  {getRoleLabel(selectedUser.type_utilisateur)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#636E72' }}>
                  Statut
                </Typography>
                <Chip
                  label={selectedUser.statut}
                  size="small"
                  sx={{
                    ...getStatusColor(selectedUser.statut),
                    background: getStatusColor(selectedUser.statut).bg,
                    color: getStatusColor(selectedUser.statut).color,
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#636E72' }}>
                  Date de création
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedUser.date_creation).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
              {selectedUser.derniere_connexion && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#636E72' }}>
                    Dernière connexion
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedUser.derniere_connexion).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              )}
              {selectedUser.etudiant_matricule && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#636E72' }}>
                    Matricule étudiant
                  </Typography>
                  <Typography variant="body1">{selectedUser.etudiant_matricule}</Typography>
                </Box>
              )}
              {selectedUser.etudiant_filiere && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#636E72' }}>
                    Filière
                  </Typography>
                  <Typography variant="body1">{selectedUser.etudiant_filiere}</Typography>
                </Box>
              )}
              {selectedUser.nom_ville && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#636E72' }}>
                    Ville
                  </Typography>
                  <Typography variant="body1">{selectedUser.nom_ville}</Typography>
                </Box>
              )}
              {selectedUser.nom_region && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#636E72' }}>
                    Région
                  </Typography>
                  <Typography variant="body1">{selectedUser.nom_region}</Typography>
                </Box>
              )}
              {selectedUser.nom_etablissement && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#636E72' }}>
                    Établissement
                  </Typography>
                  <Typography variant="body1">{selectedUser.nom_etablissement}</Typography>
                </Box>
              )}
              {selectedUser.nom_rectorat && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#636E72' }}>
                    Université
                  </Typography>
                  <Typography variant="body1">{selectedUser.nom_rectorat}</Typography>
                </Box>
              )}
              {selectedUser.enseignant_grade && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#636E72' }}>
                    Grade
                  </Typography>
                  <Typography variant="body1">{selectedUser.enseignant_grade}</Typography>
                </Box>
              )}
              {selectedUser.enseignant_specialite && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#636E72' }}>
                    Spécialité
                  </Typography>
                  <Typography variant="body1">{selectedUser.enseignant_specialite}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDetailsOpen(false)}
            sx={{
              color: '#2575E8',
              fontWeight: 700,
              '&:hover': { background: '#EFF6FF' },
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default UserManagement;
