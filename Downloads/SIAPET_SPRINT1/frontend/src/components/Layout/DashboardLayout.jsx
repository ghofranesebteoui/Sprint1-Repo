import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Badge, InputBase, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Assessment,
  Description,
  Person,
  Settings as SettingsIcon,
  Notifications,
  Search,
  Logout,
} from '@mui/icons-material';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/dashboard/profile');
  };

  const handleSettingsClick = () => {
    handleProfileMenuClose();
    navigate('/settings');
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getUserRole = () => {
    const pathRole = location.pathname.split('/')[2];
    if (pathRole && pathRole !== 'profile') {
      return pathRole;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const roleMapping = {
      'ADMIN_MESRS': 'admin',
      'RECTEUR': 'recteur',
      'DIRECTEUR': 'directeur',
      'ENSEIGNANT': 'enseignant',
      'ETUDIANT': 'etudiant',
    };
    return roleMapping[user.role] || 'admin';
  };

  const userRole = getUserRole();

  const menuItems = {
    admin: [
      { text: 'Vue d\'ensemble', icon: <Dashboard />, path: '/dashboard/admin', active: true },
      { text: 'Universités', icon: <School />, path: '/universites' },
      { text: 'Analytics', icon: <Assessment />, path: '/analytics' },
      { text: 'Rapports', icon: <Description />, path: '/reports' },
    ],
    recteur: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard/recteur', active: true },
      { text: 'Établissements', icon: <School />, path: '/etablissements' },
      { text: 'Statistiques', icon: <Assessment />, path: '/statistics' },
      { text: 'Rapports', icon: <Description />, path: '/reports' },
    ],
    directeur: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard/directeur', active: true },
      { text: 'Étudiants', icon: <School />, path: '/students' },
      { text: 'Enseignants', icon: <School />, path: '/teachers' },
      { text: 'Rapports', icon: <Description />, path: '/reports' },
    ],
    enseignant: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard/enseignant', active: true },
      { text: 'Mes classes', icon: <School />, path: '/classes' },
      { text: 'Notes', icon: <Assessment />, path: '/grades' },
      { text: 'Analyses', icon: <Assessment />, path: '/analyses' },
    ],
    etudiant: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard/etudiant', active: true },
      { text: 'Mes cours', icon: <School />, path: '/courses' },
      { text: 'Mes notes', icon: <Assessment />, path: '/grades' },
      { text: 'Objectifs', icon: <Assessment />, path: '/goals' },
    ],
  };

  const accountItems = [
    { text: 'Mon Profil', icon: <Person />, path: '/dashboard/profile' },
    { text: 'Paramètres', icon: <SettingsIcon />, path: '/settings' },
  ];

  const roleNames = {
    admin: 'Administrateur',
    recteur: 'Recteur',
    directeur: 'Directeur',
    enseignant: 'Enseignant',
    etudiant: 'Étudiant',
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F0F6FF' }}>
      {/* SIDEBAR */}
      <Box
        sx={{
          width: '260px',
          flexShrink: 0,
          background: '#FFFFFF',
          borderRight: '1px solid #E8EEF7',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '28px',
            fontWeight: 900,
            color: '#2575E8',
            letterSpacing: '1.5px',
            padding: '20px 16px 16px',
            textTransform: 'uppercase',
          }}
        >
          SIAPET
        </Box>

        {/* Profile */}
        <Box
          sx={{
            background: '#E8F1FB',
            borderRadius: '20px',
            padding: '16px',
            margin: '0 16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <Box
            sx={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              flexShrink: 0,
              background: 'linear-gradient(145deg, #90CAF9, #64B5F6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            🧑‍💼
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ 
              fontSize: '16px', 
              fontWeight: 800, 
              color: '#1A237E', 
              marginBottom: '6px',
              fontFamily: '"Nunito", sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {roleNames[userRole]}
            </Box>
            <Box
              sx={{
                fontSize: '13px',
                color: '#66BB6A',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontWeight: 600,
                fontFamily: '"Nunito Sans", sans-serif',
              }}
            >
              <Box
                sx={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#66BB6A',
                  flexShrink: 0,
                  animation: 'pulse 2s ease infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                  },
                }}
              />
              En ligne
            </Box>
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {menuItems[userRole]?.map((item) => (
            <Box
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '50px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                ...(isActive(item.path)
                  ? {
                      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                      color: 'white',
                    }
                  : {
                      color: '#475569',
                      '&:hover': {
                        background: '#F8FAFC',
                        color: '#1E293B',
                      },
                    }),
              }}
            >
              <Box
                sx={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: isActive(item.path) ? 'rgba(255, 255, 255, 0.2)' : '#FFF9F5',
                  transition: 'all 0.2s ease',
                  '& svg': {
                    width: '18px',
                    height: '18px',
                    color: isActive(item.path) ? 'white' : '#2575E8',
                  },
                }}
              >
                {item.icon}
              </Box>
              <Box
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: '"Nunito Sans", sans-serif',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.text}
              </Box>
            </Box>
          ))}

          {/* Section Compte */}
          <Box
            sx={{
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#CBD5E1',
              padding: '20px 12px 10px',
            }}
          >
            COMPTE
          </Box>

          {accountItems.map((item) => (
            <Box
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '50px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                ...(isActive(item.path)
                  ? {
                      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                      color: 'white',
                    }
                  : {
                      color: '#475569',
                      '&:hover': {
                        background: '#F8FAFC',
                        color: '#1E293B',
                      },
                    }),
              }}
            >
              <Box
                sx={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: isActive(item.path) ? 'rgba(255, 255, 255, 0.2)' : '#FFF9F5',
                  transition: 'all 0.2s ease',
                  '& svg': {
                    width: '18px',
                    height: '18px',
                    color: isActive(item.path) ? 'white' : '#2575E8',
                  },
                }}
              >
                {item.icon}
              </Box>
              <Box
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: '"Nunito Sans", sans-serif',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.text}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            padding: '16px',
            borderTop: '1px solid #F1F5F9',
            marginTop: 'auto',
          }}
        >
          <Box
            sx={{
              fontSize: '11px',
              color: '#94A3B8',
              textAlign: 'center',
              fontFamily: '"Nunito Sans", sans-serif',
            }}
          >
            Version 1.0.0
          </Box>
        </Box>
      </Box>

      {/* MAIN */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* TOPBAR */}
        <Box
          sx={{
            height: '72px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FBFF 100%)',
            borderBottom: '1px solid #E8EEF7',
            display: 'flex',
            alignItems: 'center',
            padding: '0 32px',
            gap: '16px',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          {/* Toggle Button */}
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              border: '1.5px solid #C8DCFF',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                borderColor: '#93C5FD',
                transform: 'scale(1.05)',
              },
              '& svg': {
                color: '#2575E8',
                width: '20px',
                height: '20px',
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search */}
          <Box
            sx={{
              flex: 1,
              maxWidth: '420px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #F0F7FF 0%, #E3F2FD 100%)',
              border: '1.5px solid #C8DCFF',
              borderRadius: '14px',
              padding: '0 16px',
              transition: 'all 0.2s ease',
              '&:focus-within': {
                background: 'white',
                borderColor: '#2575E8',
                boxShadow: '0 0 0 4px rgba(37, 117, 232, 0.1)',
              },
            }}
          >
            <Search sx={{ color: '#9DB8D8', width: '18px', height: '18px', flexShrink: 0 }} />
            <InputBase
              placeholder="Rechercher..."
              sx={{
                fontSize: '14px',
                color: '#0C1B3E',
                width: '100%',
                fontFamily: '"Nunito Sans", sans-serif',
                fontWeight: 500,
                '&::placeholder': {
                  color: '#9DB8D8',
                  opacity: 1,
                },
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Notifications */}
            <Box
              sx={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: '#E3F2FD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#BBDEFB',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(144, 202, 249, 0.3)',
                },
              }}
            >
              <Notifications sx={{ color: '#2575E8', fontSize: '24px' }} />
              <Box
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'linear-gradient(135deg, #FF6B47 0%, #FF5733 100%)',
                  color: 'white',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 900,
                  padding: '0 4px',
                  border: '2px solid white',
                  boxShadow: '0 2px 6px rgba(255, 107, 71, 0.4)',
                }}
              >
                6
              </Box>
            </Box>

            {/* Profile Menu */}
            <Box
              onClick={handleProfileMenuOpen}
              sx={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: '#90CAF9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#80BAE9',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(144, 202, 249, 0.3)',
                },
              }}
            >
              <Box
                sx={{
                  fontSize: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🧑‍💼
              </Box>
            </Box>

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: '14px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  border: '1px solid #E8EEF7',
                  overflow: 'hidden',
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }}>
                <Box sx={{ fontWeight: 700, fontSize: '14px', color: '#1A237E', fontFamily: '"Nunito", sans-serif' }}>
                  Administrateur
                </Box>
                <Box sx={{ fontSize: '12px', color: '#64748B', mt: 0.5, fontFamily: '"Nunito Sans", sans-serif' }}>
                  admin@siapet.tn
                </Box>
              </Box>
              <Divider sx={{ my: 0 }} />
              <MenuItem
                onClick={handleProfileClick}
                sx={{
                  py: 1.5,
                  px: 2,
                  gap: 1.5,
                  fontFamily: '"Nunito Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#475569',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                    color: '#2575E8',
                  },
                }}
              >
                <Person sx={{ fontSize: 20, color: '#2575E8' }} />
                Mon Profil
              </MenuItem>
              <MenuItem
                onClick={handleSettingsClick}
                sx={{
                  py: 1.5,
                  px: 2,
                  gap: 1.5,
                  fontFamily: '"Nunito Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#475569',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                    color: '#2575E8',
                  },
                }}
              >
                <SettingsIcon sx={{ fontSize: 20, color: '#2575E8' }} />
                Paramètres
              </MenuItem>
              <Divider sx={{ my: 0 }} />
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  px: 2,
                  gap: 1.5,
                  fontFamily: '"Nunito Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#FF6B47',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFF0EC 0%, #FFE5DD 100%)',
                  },
                }}
              >
                <Logout sx={{ fontSize: 20 }} />
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            background: '#F0F6FF',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#B0CCFF',
              borderRadius: '4px',
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
