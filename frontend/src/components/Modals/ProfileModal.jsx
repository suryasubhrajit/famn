import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Avatar,
  IconButton,
  useTheme,
} from '@mui/material';
import { X, Check } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const AVATAR_COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#EF4444'];

export const ProfileModal = () => {
  const theme = useTheme();
  const { activeModal, setActiveModal, handle, setHandle, avatarColor, setAvatarColor } = useChat();
  const [tempName, setTempName] = useState(handle || 'NeonPhoenix');
  const [selectedColor, setSelectedColor] = useState(avatarColor || '#6366F1');

  const open = activeModal === 'profile';

  const handleClose = () => {
    setActiveModal(null);
  };

  const handleSave = () => {
    if (tempName && tempName.trim()) {
      setHandle(tempName.trim());
      setAvatarColor(selectedColor);
    }
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          bgcolor: theme.palette.background.paper,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Customize Session Handle
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', pt: 1 }}>
          {/* Avatar Preview */}
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: selectedColor,
              fontSize: '1.8rem',
              fontWeight: 800,
              mx: 'auto',
              mb: 2,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            {tempName ? tempName.charAt(0).toUpperCase() : 'P'}
          </Avatar>

          {/* Color Selector */}
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
            CHOOSE AVATAR ACCENT COLOR
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            {AVATAR_COLORS.map((color) => (
              <Box
                key={color}
                onClick={() => setSelectedColor(color)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: color,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: selectedColor === color ? '3px solid #FFF' : 'none',
                  boxShadow: selectedColor === color ? '0 0 0 2px #6366F1' : 'none',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.15)' },
                }}
              >
                {selectedColor === color && <Check size={16} color="#FFF" />}
              </Box>
            ))}
          </Box>

          {/* Username Input */}
          <TextField
            fullWidth
            label="Temporary Session Handle"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            variant="outlined"
            placeholder="e.g. NeonPhoenix"
            sx={{ mb: 1 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!tempName || !tempName.trim()}
          sx={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            px: 3,
          }}
        >
          Save Handle
        </Button>
      </DialogActions>
    </Dialog>
  );
};
