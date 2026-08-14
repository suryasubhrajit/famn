import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Divider,
  Chip,
  Paper,
  Alert,
  useTheme,
} from '@mui/material';
import { ShieldCheck, Zap, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const RoomLanding = () => {
  const theme = useTheme();
  const { createNewRoom, joinRoom, handle, mode, roomNoticeAlert, setRoomNoticeAlert } = useChat();
  const [joinInput, setJoinInput] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (joinInput.trim()) {
      joinRoom(joinInput.trim());
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        bgcolor: theme.palette.background.default,
        overflowY: 'auto',
      }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: 520,
          width: '100%',
          borderRadius: { xs: '20px', sm: '24px' },
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: mode === 'dark' ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 30px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          my: 'auto',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 4 }, textAlign: 'center' }}>
          {roomNoticeAlert && (
            <Alert
              severity="warning"
              onClose={() => setRoomNoticeAlert(null)}
              icon={<AlertCircle size={18} />}
              sx={{
                mb: 3,
                borderRadius: '12px',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              {roomNoticeAlert}
            </Alert>
          )}

          {/* Main Icon */}
          <img
            src={`${BACKEND_URL}/public/logo.svg?v=3`}
            alt="Fun At Mid Night"
            style={{
              width: 64,
              height: 64,
              borderRadius: '18px',
              display: 'block',
              margin: '0 auto 20px auto',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            }}
          />

          {/* Heading */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              mb: 1,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            Fun At Mid Night Chat
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 3,
              lineHeight: 1.5,
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
            }}
          >
            Private 2-person chat. No signups required. Messages automatically vanish when your session ends.
          </Typography>

          {/* Action 1: Create Instant Room */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={createNewRoom}
            startIcon={<Zap size={18} />}
            sx={{
              py: { xs: 1.3, sm: 1.5 },
              borderRadius: '14px',
              fontSize: { xs: '0.92rem', sm: '1rem' },
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)',
              mb: 2.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              },
            }}
          >
            Create Instant Room & Get Link
          </Button>

          <Divider sx={{ my: 2.5, fontSize: '0.72rem', color: 'text.secondary' }}>OR JOIN EXISTING ROOM</Divider>

          {/* Action 2: Join Form */}
          <Box
            component="form"
            onSubmit={handleJoin}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.2,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Paste room code (e.g. tsy-cusn-bti)"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                },
              }}
            />
            <Button
              type="submit"
              variant="outlined"
              disabled={!joinInput.trim()}
              endIcon={<ArrowRight size={18} />}
              sx={{
                borderRadius: '12px',
                px: 2.5,
                py: { xs: 1, sm: 0 },
                whiteSpace: 'nowrap',
                fontWeight: 700,
              }}
            >
              Join
            </Button>
          </Box>

          {/* Temporary Session Info Box */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: { xs: 1.5, sm: 2 },
              borderRadius: '14px',
              bgcolor: theme.palette.background.subtle,
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, textAlign: 'left' }}>
              <Lock size={18} color="#10B981" />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', display: 'block' }}>
                  Session: {handle}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                  Messages auto-expire when tab closes
                </Typography>
              </Box>
            </Box>

            <Chip
              icon={<ShieldCheck size={12} color="#10B981" />}
              label="Protected"
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', color: '#10B981', bgcolor: 'rgba(16, 185, 129, 0.1)' }}
            />
          </Paper>

          {/* Powered by Boofer Section */}
          <Paper
            elevation={0}
            sx={{
              mt: 2.5,
              p: { xs: 2, sm: 2.5 },
              borderRadius: '16px',
              bgcolor: mode === 'dark' ? 'rgba(0, 163, 255, 0.06)' : 'rgba(0, 163, 255, 0.04)',
              border: '1px solid rgba(0, 163, 255, 0.25)',
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.08em' }}>
                POWERED BY
              </Typography>
              <img
                src={`${BACKEND_URL}/public/images/boofer.png`}
                alt="Boofer"
                style={{ height: 22, objectFit: 'contain', filter: mode === 'dark' ? 'invert(1) brightness(2)' : 'none' }}
              />
            </Box>

            <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary', mb: 2, lineHeight: 1.4 }}>
              Experience fast, private & secure real-time messaging with Boofer. Download the official Android app.
            </Typography>

            <Button
              component="a"
              href="https://play.google.com/store/apps/details?id=com.shaadow.boofer.android"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="small"
              sx={{
                borderRadius: '12px',
                px: 2.5,
                py: 0.9,
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #00A3FF 0%, #0066FF 100%)',
                boxShadow: '0 4px 14px rgba(0, 163, 255, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0092E6 0%, #0052CC 100%)',
                },
              }}
            >
              Get Boofer on Google Play
            </Button>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};
