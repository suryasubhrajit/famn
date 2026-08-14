import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  useTheme,
  Button,
  Popover,
  Avatar,
  Paper,
  Badge,
  useMediaQuery,
} from '@mui/material';
import {
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Users,
  Zap,
  WifiOff,
  User,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const MinimalHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    roomId,
    handle,
    avatarColor,
    peers,
    mode,
    toggleTheme,
    copyInviteLink,
    copySuccess,
    leaveRoom,
    setActiveModal,
    isOffline,
  } = useChat();

  const [peersAnchor, setPeersAnchor] = useState(null);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.glass,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Offline Alert Strip */}
      {isOffline && (
        <Box
          sx={{
            bgcolor: '#EF4444',
            color: '#FFFFFF',
            py: 0.5,
            px: 2,
            textAlign: 'center',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <WifiOff size={14} />
          <span>⚠️ No Internet Connection. Attempting to reconnect...</span>
        </Box>
      )}

      <Toolbar
        sx={{
          justifyContent: 'space-between',
          px: { xs: 1.5, sm: 3, md: 4 },
          minHeight: { xs: 56, sm: 64 },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Brand & Room Code */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: { xs: 28, sm: 34 },
                height: { xs: 28, sm: 34 },
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(99, 102, 241, 0.3)',
              }}
            >
              <Zap size={isMobile ? 16 : 20} color="#FFFFFF" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.05rem', sm: '1.25rem' },
              }}
            >
              Pulse<span style={{ color: '#6366F1' }}>P2P</span>
            </Typography>
          </Box>

          {roomId && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip
                label={isMobile ? roomId.replace('room-', '') : roomId}
                size="small"
                onClick={copyInviteLink}
                icon={copySuccess ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: { xs: '0.72rem', sm: '0.8rem' },
                  bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                  color: theme.palette.primary.main,
                  border: `1px solid ${theme.palette.primary.main}40`,
                  px: 0.2,
                  maxWidth: { xs: 100, sm: 'none' },
                  cursor: 'pointer',
                }}
              />

              <Tooltip title="Show Room QR Code">
                <IconButton size="small" onClick={() => setActiveModal('qrCode')} sx={{ p: { xs: 0.5, sm: 1 } }}>
                  <QrCode size={16} color={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.2 } }}>
          {roomId ? (
            <>
              {/* Connected Peers Status Chip */}
              <Chip
                icon={<Users size={12} color="#10B981" />}
                label={isMobile ? `${peers.length}` : `🟢 ${peers.length} Online`}
                size="small"
                variant="outlined"
                onClick={(e) => setPeersAnchor(e.currentTarget)}
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  color: '#10B981',
                  cursor: 'pointer',
                  height: 26,
                  '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' },
                }}
              />

              {/* User Profile Button */}
              <Tooltip title="Session Profile">
                <Box
                  onClick={() => setActiveModal('profile')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    cursor: 'pointer',
                    p: 0.4,
                    borderRadius: '10px',
                    '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 26,
                      height: 26,
                      bgcolor: avatarColor,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {handle.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                    {handle}
                  </Typography>
                </Box>
              </Tooltip>

              {/* Bot Shield */}
              <Tooltip title="reCAPTCHA v3 Active">
                <IconButton size="small" onClick={() => setActiveModal('captcha')} sx={{ p: { xs: 0.5, sm: 1 } }}>
                  <ShieldCheck size={18} color="#10B981" />
                </IconButton>
              </Tooltip>

              {/* Theme Toggle */}
              <IconButton onClick={toggleTheme} size="small" sx={{ p: { xs: 0.5, sm: 1 } }}>
                {mode === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#6366F1" />}
              </IconButton>

              {/* Exit Button */}
              {isMobile ? (
                <IconButton color="error" size="small" onClick={leaveRoom} sx={{ p: 0.5 }}>
                  <LogOut size={18} />
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={leaveRoom}
                  startIcon={<LogOut size={16} />}
                  sx={{ borderRadius: '10px', textTransform: 'none', px: 1.5, py: 0.4, fontWeight: 700 }}
                >
                  Leave
                </Button>
              )}
            </>
          ) : (
            <IconButton onClick={toggleTheme} size="small" sx={{ p: { xs: 0.5, sm: 1 } }}>
              {mode === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#6366F1" />}
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Connected Peers Popover */}
      <Popover
        open={Boolean(peersAnchor)}
        anchorEl={peersAnchor}
        onClose={() => setPeersAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            minWidth: 200,
            borderRadius: '16px',
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1.5, letterSpacing: '0.05em' }}>
            CONNECTED SESSION PEERS ({peers.length})
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {peers.map((peer) => (
              <Box key={peer.id || peer.handle} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{ '& .MuiBadge-badge': { backgroundColor: '#10B981' } }}
                >
                  <Avatar sx={{ width: 28, height: 28, bgcolor: peer.color || '#6366F1', fontSize: '0.75rem', fontWeight: 700 }}>
                    {peer.handle ? peer.handle.charAt(0).toUpperCase() : 'P'}
                  </Avatar>
                </Badge>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.2 }}>
                    {peer.handle} {peer.handle === handle && '(You)'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#10B981', fontSize: '0.68rem', fontWeight: 600 }}>
                    🟢 Active Online
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Popover>
    </AppBar>
  );
};
