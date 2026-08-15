import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  Avatar,
  Badge,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Zap,
  Copy,
  Check,
  QrCode,
  Clock,
  ShieldCheck,
  Users,
  Sun,
  Moon,
  LogOut,
  User,
  Plus,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const RoomSidebar = ({ onCloseMobileDrawer }) => {
  const theme = useTheme();
  const {
    roomId,
    handle,
    avatarColor,
    peers,
    roomTTL,
    setRoomTTL,
    mode,
    toggleTheme,
    copyInviteLink,
    copySuccess,
    leaveRoom,
    createNewRoom,
    setActiveModal,
  } = useChat();

  const [ttlAnchor, setTtlAnchor] = useState(null);

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 300, lg: 320 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        p: 2.5,
        overflowY: 'auto',
      }}
    >
      {/* Brand Logo Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <img
            src={`${BACKEND_URL}/public/logo.svg?v=3`}
            alt="Fun At Mid Night"
            style={{ width: 36, height: 36, borderRadius: '10px', display: 'block' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.1rem' }}>
            Fun At<span style={{ color: '#6366F1' }}> Mid Night</span>
          </Typography>
        </Box>

        <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
          <IconButton onClick={toggleTheme} size="small">
            {mode === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#6366F1" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Active Room Info Card */}
      {roomId ? (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '16px',
            bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
            border: `1px solid ${theme.palette.primary.main}30`,
            mb: 3,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.08em', display: 'block', mb: 0.8 }}>
            ACTIVE ROOM
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: 'monospace', mb: 1.5, wordBreak: 'break-all' }}>
            #{roomId}
          </Typography>

          {/* Quick Actions */}
          {peers.length < 2 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                size="small"
                variant="contained"
                onClick={copyInviteLink}
                startIcon={copySuccess ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                sx={{
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                }}
              >
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </Button>

              <Tooltip title="Show Room QR Code">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setActiveModal('qrCode');
                    if (onCloseMobileDrawer) onCloseMobileDrawer();
                  }}
                  sx={{ borderRadius: '10px', minWidth: 40, p: 0 }}
                >
                  <QrCode size={16} />
                </Button>
              </Tooltip>
            </Box>
          )}
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '16px',
            bgcolor: theme.palette.background.subtle,
            border: `1px solid ${theme.palette.divider}`,
            mb: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
            No Active Room Joined
          </Typography>
          <Button
            fullWidth
            size="small"
            variant="contained"
            onClick={createNewRoom}
            startIcon={<Plus size={16} />}
            sx={{
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            }}
          >
            Create Instant Room
          </Button>
        </Paper>
      )}

      {/* Message TTL Selector */}
      {roomId && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.08em', display: 'block', mb: 1 }}>
            AUTO-DELETE MESSAGES
          </Typography>
          <Paper
            elevation={0}
            onClick={(e) => setTtlAnchor(e.currentTarget)}
            sx={{
              p: 1.2,
              px: 2,
              borderRadius: '12px',
              bgcolor: theme.palette.background.subtle,
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              '&:hover': { borderColor: theme.palette.primary.main },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={16} color={theme.palette.primary.main} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {roomTTL === '15m' ? '15 Minutes' : roomTTL === '1h' ? '1 Hour' : roomTTL === '24h' ? '24 Hours' : 'Burn on Read'}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Change</Typography>
          </Paper>

          <Menu anchorEl={ttlAnchor} open={Boolean(ttlAnchor)} onClose={() => setTtlAnchor(null)}>
            <MenuItem onClick={() => { setRoomTTL('15m'); setTtlAnchor(null); }}>15 Minutes</MenuItem>
            <MenuItem onClick={() => { setRoomTTL('1h'); setTtlAnchor(null); }}>1 Hour</MenuItem>
            <MenuItem onClick={() => { setRoomTTL('24h'); setTtlAnchor(null); }}>24 Hours</MenuItem>
            <MenuItem onClick={() => { setRoomTTL('burn'); setTtlAnchor(null); }}>Burn on Read</MenuItem>
          </Menu>
        </Box>
      )}

      {/* Connected Session Peers */}
      {roomId && (
        <Box sx={{ mb: 3, flex: 1 }}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.08em', display: 'block', mb: 1 }}>
            PEOPLE IN THIS ROOM ({peers.length})
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {peers.map((peer) => (
              <Paper
                key={peer.id || peer.handle}
                elevation={0}
                sx={{
                  p: 1.2,
                  borderRadius: '12px',
                  bgcolor: theme.palette.background.subtle,
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                }}
              >
                <Avatar sx={{ width: 28, height: 28, bgcolor: peer.color || '#6366F1', fontSize: '0.75rem', fontWeight: 700 }}>
                  {peer.handle.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  {peer.handle} {peer.handle === handle ? '(You)' : ''}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 2, opacity: 0.6 }} />

      {/* Profile & Security Footer */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* User Handle Profile Box */}
        <Paper
          elevation={0}
          onClick={() => {
            setActiveModal('profile');
            if (onCloseMobileDrawer) onCloseMobileDrawer();
          }}
          sx={{
            p: 1.2,
            borderRadius: '12px',
            bgcolor: theme.palette.background.subtle,
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            '&:hover': { borderColor: theme.palette.primary.main },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: avatarColor, fontSize: '0.8rem', fontWeight: 700 }}>
              {handle.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                {handle}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                Temporary Session
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>Edit</Typography>
        </Paper>

        {/* Security Indicator */}
        <Chip
          icon={<ShieldCheck size={14} color="#10B981" />}
          label="Protected Session"
          size="small"
          sx={{
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: '0.75rem',
            py: 1.5,
            bgcolor: 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            border: '1px solid rgba(16, 185, 129, 0.25)',
          }}
          variant="outlined"
        />

        {/* Leave Room Button */}
        {roomId && (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={leaveRoom}
            startIcon={<LogOut size={16} />}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
          >
            Leave Room
          </Button>
        )}
      </Box>
    </Box>
  );
};
