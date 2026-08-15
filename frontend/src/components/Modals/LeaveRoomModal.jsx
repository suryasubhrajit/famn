import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import { AlertTriangle, LogOut, ArrowLeft } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const LeaveRoomModal = () => {
  const theme = useTheme();
  const { showLeaveModal, setShowLeaveModal, leaveRoom, roomId } = useChat();

  if (!roomId) return null;

  return (
    <Dialog
      open={Boolean(showLeaveModal)}
      onClose={() => setShowLeaveModal(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          p: 1,
          bgcolor: theme.palette.background.paper,
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ p: 1.2, borderRadius: '14px', bgcolor: 'rgba(239, 68, 68, 0.15)', display: 'inline-flex' }}>
          <AlertTriangle size={24} color="#EF4444" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2 }}>
            Leave Ephemeral Room?
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Back Button Action Intercepted
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 1.5 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.88rem' }}>
          You are currently in an active 2-person chat room <strong style={{ color: theme.palette.text.primary }}>#{roomId}</strong>. Navigating back or exiting will disconnect your session and destroy temporary room history.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, flexDirection: { xs: 'column-reverse', sm: 'row' } }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={leaveRoom}
          startIcon={<LogOut size={16} />}
          sx={{
            borderRadius: '12px',
            fontWeight: 700,
            textTransform: 'none',
            py: 1,
          }}
        >
          Leave Room & Exit
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={() => setShowLeaveModal(false)}
          startIcon={<ArrowLeft size={16} />}
          sx={{
            borderRadius: '12px',
            fontWeight: 800,
            textTransform: 'none',
            py: 1,
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          }}
        >
          Stay in Room
        </Button>
      </DialogActions>
    </Dialog>
  );
};
