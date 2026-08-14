import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import { X, Keyboard, MessageSquare, Smile, Paperclip, Reply, CornerDownLeft } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const ShortcutsModal = () => {
  const theme = useTheme();
  const { activeModal, setActiveModal, mode } = useChat();

  const open = activeModal === 'shortcuts';

  const handleClose = () => {
    setActiveModal(null);
  };

  const SHORTCUTS = [
    {
      icon: <MessageSquare size={18} color="#6366F1" />,
      action: 'Focus Input Box',
      keys: ['Ctrl', '/'],
    },
    {
      icon: <Smile size={18} color="#F59E0B" />,
      action: 'Toggle Emoji Picker',
      keys: ['Ctrl', '.'],
      altKeys: ['Alt', 'E'],
    },
    {
      icon: <Paperclip size={18} color="#10B981" />,
      action: 'Attach File / Media',
      keys: ['Ctrl', 'Shift', 'U'],
      altKeys: ['Alt', 'A'],
    },
    {
      icon: <Reply size={18} color="#EC4899" />,
      action: 'Reply to Message',
      keys: ['Double Click Row'],
    },
    {
      icon: <CornerDownLeft size={18} color="#3B82F6" />,
      action: 'Send Message',
      keys: ['Enter'],
    },
    {
      icon: <X size={18} color="#EF4444" />,
      action: 'Cancel Reply / Close',
      keys: ['Esc'],
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: theme.palette.background.paper,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Keyboard size={22} color={theme.palette.primary.main} /> Keyboard Shortcuts
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.85rem' }}>
          Speed up your messaging experience with these desktop hotkeys:
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          {SHORTCUTS.map((item, idx) => (
            <Paper
              key={idx}
              elevation={0}
              sx={{
                p: 1.3,
                px: 1.8,
                borderRadius: '14px',
                bgcolor: theme.palette.background.subtle,
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                {item.icon}
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  {item.action}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {item.keys.map((k, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      px: 0.8,
                      py: 0.2,
                      borderRadius: '6px',
                      bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                      border: `1px solid ${theme.palette.divider}`,
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                    }}
                  >
                    {k}
                  </Paper>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button fullWidth variant="contained" onClick={handleClose} sx={{ borderRadius: '12px', fontWeight: 700 }}>
          Got It
        </Button>
      </DialogActions>
    </Dialog>
  );
};
