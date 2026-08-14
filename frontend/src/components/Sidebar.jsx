import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Badge,
  Paper,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Users, Hash, Shield, Sparkles, FolderPlus } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const Sidebar = () => {
  const theme = useTheme();
  const { rooms, activeRoom, setActiveRoom, onlineUsers, mode, setActiveModal } = useChat();

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 280 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Rooms Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: '0.1em', color: 'text.secondary' }}>
          CHANNELS & ROOMS
        </Typography>

        <Tooltip title="Upload & Share File directly">
          <Paper
            elevation={0}
            onClick={() => setActiveModal('fileUpload')}
            sx={{
              p: 0.8,
              borderRadius: '8px',
              bgcolor: theme.palette.primary.main,
              color: '#FFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <FolderPlus size={16} />
          </Paper>
        </Tooltip>
      </Box>

      {/* Room List */}
      <List sx={{ px: 1, py: 0 }}>
        {rooms.map((room) => {
          const isSelected = activeRoom.id === room.id;
          return (
            <ListItemButton
              key={room.id}
              selected={isSelected}
              onClick={() => setActiveRoom(room)}
              sx={{
                borderRadius: '12px',
                mb: 0.8,
                py: 1,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.15)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, fontSize: '1.2rem' }}>
                {room.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500 }}>
                    {room.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" noWrap sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                    {room.topic}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 1.5, opacity: 0.6 }} />

      {/* Online Members Header */}
      <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: '0.1em', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Users size={14} /> ONLINE MEMBERS ({onlineUsers.length})
        </Typography>
      </Box>

      {/* Members List */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1, pb: 2 }}>
        <List disablePadding>
          {onlineUsers.map((user) => (
            <ListItemButton
              key={user.id}
              sx={{
                borderRadius: '10px',
                py: 0.8,
                mb: 0.5,
                '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 42 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: user.status === 'idle' ? '#F59E0B' : '#10B981',
                      border: `2px solid ${theme.palette.background.paper}`,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: user.color,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {user.name} {user.status === 'bot' && <Sparkles size={12} color="#6366F1" style={{ marginLeft: 4 }} />}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                    {user.bio}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Footer Info Box */}
      <Paper
        elevation={0}
        sx={{
          m: 1.5,
          p: 1.5,
          borderRadius: '12px',
          bgcolor: theme.palette.background.subtle,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Shield size={16} color="#10B981" />
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
            No-Login Instant Access
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.3 }}>
          Protected by reCAPTCHA v3 bot shield. File uploads support images, PDFs, & audio.
        </Typography>
      </Paper>
    </Box>
  );
};
