import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  Tooltip,
  Paper,
  useTheme,
} from '@mui/material';
import { Search, Trash2, ShieldCheck, FileText, Info } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const ChatHeader = () => {
  const theme = useTheme();
  const { activeRoom, onlineUsers, isCaptchaVerified, setActiveModal } = useChat();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box
      sx={{
        px: 3,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Left Details */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ fontSize: '1.6rem' }}>{activeRoom.icon}</Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            #{activeRoom.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {activeRoom.topic} • {onlineUsers.length} members online
          </Typography>
        </Box>
      </Box>

      {/* Right Tools */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showSearch ? (
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.3,
              borderRadius: '20px',
              bgcolor: theme.palette.background.subtle,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Search size={16} color={theme.palette.text.secondary} />
            <InputBase
              placeholder="Search chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              sx={{ ml: 1, fontSize: '0.85rem', width: 140 }}
            />
            <IconButton size="small" onClick={() => setShowSearch(false)}>
              ×
            </IconButton>
          </Paper>
        ) : (
          <Tooltip title="Search Messages">
            <IconButton size="small" onClick={() => setShowSearch(true)}>
              <Search size={18} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Upload & Share File">
          <IconButton size="small" onClick={() => setActiveModal('fileUpload')}>
            <FileText size={18} />
          </IconButton>
        </Tooltip>

        <Tooltip title="reCAPTCHA Security Guard">
          <IconButton size="small" onClick={() => setActiveModal('captcha')}>
            <ShieldCheck size={18} color="#10B981" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
