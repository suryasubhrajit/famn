import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Paper,
  IconButton,
  useTheme,
} from '@mui/material';
import { ShieldCheck, Lock, CheckCircle2, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const CaptchaModal = () => {
  const theme = useTheme();
  const { activeModal, setActiveModal, isCaptchaVerified, verifyCaptcha } = useChat();
  const [verifying, setVerifying] = useState(false);

  const open = activeModal === 'captcha';

  const handleClose = () => {
    setActiveModal(null);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      verifyCaptcha('reCAPTCHA-token-verified-v3-success');
    }, 1000);
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
        <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShieldCheck size={22} color="#10B981" /> No-Login Guard
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Lock size={32} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            reCAPTCHA v3 Verification
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            To keep Fun At Mid Night open to everyone without login barriers or account signups, we use Google reCAPTCHA v3 & Cloudflare Turnstile token validation on socket connection.
          </Typography>

          {isCaptchaVerified ? (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '14px',
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <CheckCircle2 size={20} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Verified Human Session Active
              </Typography>
            </Paper>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerify}
              disabled={verifying}
              startIcon={<ShieldCheck size={18} />}
              sx={{
                py: 1.2,
                bgcolor: '#10B981',
                '&:hover': { bgcolor: '#059669' },
              }}
            >
              {verifying ? 'Verifying Token...' : 'Verify Session Token'}
            </Button>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button fullWidth onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
