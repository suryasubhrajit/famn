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
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
import { X, Copy, Check, QrCode, Lock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useChat } from '../../context/ChatContext';

export const QRCodeModal = () => {
  const theme = useTheme();
  const { activeModal, setActiveModal, roomId, copyInviteLink, copySuccess, mode } = useChat();

  const open = activeModal === 'qrCode';
  // Clean URL Path: e.g. http://localhost:5173/tsy-cusn-bti or https://famn.vercel.app/tsy-cusn-bti
  const roomUrl = `${window.location.origin}/${roomId || ''}`;

  const handleClose = () => {
    setActiveModal(null);
  };

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
          textAlign: 'center',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <QrCode size={22} color={theme.palette.primary.main} /> Share Room Link
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, textAlign: 'center' }}>
          Scan this QR Code with a camera or share the direct link to invite your partner into this private session.
        </Typography>

        {/* QR Code Graphic Box (High contrast white container centered) */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '20px',
            bgcolor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2.5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          {roomId ? (
            <QRCodeSVG value={roomUrl} size={180} level="H" includeMargin={false} />
          ) : null}
        </Paper>

        {/* Room Code Badge */}
        <Box sx={{ mb: 2.5, textAlign: 'center' }}>
          <Chip
            icon={<Lock size={12} color="#10B981" />}
            label={`Room: ${roomId}`}
            size="small"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '0.85rem',
              py: 0.5,
              px: 1,
              bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
              color: theme.palette.primary.main,
            }}
          />
        </Box>

        {/* Copy Link Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={copyInviteLink}
          startIcon={copySuccess ? <Check size={18} color="#10B981" /> : <Copy size={18} />}
          sx={{
            py: 1.2,
            borderRadius: '12px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          }}
        >
          {copySuccess ? 'Link Copied to Clipboard!' : 'Copy Direct Room Link'}
        </Button>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button fullWidth onClick={handleClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
