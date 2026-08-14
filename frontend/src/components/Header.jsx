import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Avatar,
  Badge,
  useTheme,
} from '@mui/material';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  User,
  MessageSquare,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const Header = () => {
  const theme = useTheme();
  const {
    username,
    avatarColor,
    mode,
    toggleTheme,
    soundEnabled,
    toggleSound,
    activeRoom,
    isConnected,
    isCaptchaVerified,
    setActiveModal,
    onlineUsers,
  } = useChat();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.glass,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(16px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 }, py: 0.5 }}>
        {/* Brand Logo & Active Channel */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            }}
          >
            <MessageSquare size={22} color="#FFFFFF" />
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #6366F1, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              PulseChat
            </Typography>

            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span>{activeRoom.icon}</span> #{activeRoom.name}
            </Typography>
          </Box>
        </Box>

        {/* Center Indicators */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
          {/* Connection Status */}
          <Tooltip title={isConnected ? 'Connected to Socket.io Server' : 'Running in Interactive Demo Mode'}>
            <Chip
              icon={isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
              label={isConnected ? 'Live Socket' : 'Demo Mode'}
              size="small"
              color={isConnected ? 'success' : 'default'}
              variant="outlined"
              sx={{ fontSize: '0.75rem', py: 0.2 }}
            />
          </Tooltip>

          {/* reCAPTCHA Guard Status */}
          <Tooltip title="reCAPTCHA v3 Protection Active">
            <Chip
              icon={<ShieldCheck size={14} color="#10B981" />}
              label="Bot Guard"
              size="small"
              sx={{
                fontSize: '0.75rem',
                bgcolor: mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                borderColor: 'rgba(16, 185, 129, 0.3)',
              }}
              variant="outlined"
              onClick={() => setActiveModal('captcha')}
            />
          </Tooltip>
        </Box>

        {/* Right Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Sound Toggle */}
          <Tooltip title={soundEnabled ? 'Mute Notifications' : 'Enable Notifications'}>
            <IconButton onClick={toggleSound} color="inherit" size="small">
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} color={theme.palette.text.secondary} />}
            </IconButton>
          </Tooltip>

          {/* Theme Mode Toggle */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
            <IconButton onClick={toggleTheme} color="inherit" size="small">
              {mode === 'dark' ? <Sun size={20} color="#F59E0B" /> : <Moon size={20} color="#6366F1" />}
            </IconButton>
          </Tooltip>

          {/* User Profile Button */}
          <Tooltip title="Customize Profile">
            <Box
              onClick={() => setActiveModal('profile')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                p: 0.5,
                borderRadius: '12px',
                '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{ '& .MuiBadge-badge': { backgroundColor: '#10B981' } }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: avatarColor,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', md: 'block' } }}>
                {username}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
