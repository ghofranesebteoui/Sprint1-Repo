import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  iconBg = 'coral',
  delay = 0,
}) => {
  const iconBackgrounds = {
    coral: 'radial-gradient(circle, #FFD0C0, #FFB0A0)',
    mint: 'radial-gradient(circle, #B8EDE8, #9EE2DC)',
    lavender: 'radial-gradient(circle, #DDD8F5, #C8C0EE)',
    peach: 'radial-gradient(circle, #FFE0B8, #FFCC90)',
  };

  const changeColors = {
    positive: { bg: '#E6F9EE', color: '#1DB954' },
    negative: { bg: '#FFF0EC', color: '#FF6B47' },
    neutral: { bg: '#EAF2FF', color: '#5D7AAA' },
  };

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 14px rgba(20, 90, 200, 0.1)',
        '&:hover': {
          boxShadow: '0 6px 26px rgba(20, 90, 200, 0.14)',
          transform: 'translateY(-4px)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(135deg, #2575E8 0%, #1050B0 100%)',
          transform: 'scaleX(0)',
          transition: 'transform 0.3s ease',
        },
        '&:hover::before': {
          transform: 'scaleX(1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: '#5D7AAA',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: '0.75rem',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#0C1B3E',
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                mb: 1,
                letterSpacing: '-1px',
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: iconBackgrounds[iconBg] || iconBackgrounds.coral,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
            }}
          >
            {icon}
          </Box>
        </Box>

        {change && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              padding: '0.25rem 0.7rem',
              borderRadius: '22px',
              background: changeColors[changeType].bg,
              color: changeColors[changeType].color,
            }}
          >
            {changeType === 'positive' && <TrendingUp sx={{ fontSize: 14 }} />}
            {changeType === 'negative' && <TrendingDown sx={{ fontSize: 14 }} />}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                fontSize: '0.75rem',
              }}
            >
              {change}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
