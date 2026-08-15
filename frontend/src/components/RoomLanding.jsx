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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Lock,
  AlertCircle,
  FileText,
  X,
  Menu as MenuIcon,
  Download,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const RoomLanding = ({ onOpenMobileDrawer }) => {
  const theme = useTheme();
  const { createNewRoom, joinRoom, handle, mode, roomNoticeAlert, setRoomNoticeAlert } = useChat();
  const [joinInput, setJoinInput] = useState('');
  const [joining, setJoining] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | 'security' | null

  const handleJoin = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!joinInput.trim() || joining) return;

    setJoining(true);
    try {
      await joinRoom(joinInput.trim());
    } finally {
      setJoining(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        p: { xs: 2, sm: 4 },
        pb: { xs: 6, sm: 8 },
        bgcolor: theme.palette.background.default,
        gap: 3,
      }}
    >
      {/* Mobile Top Bar (Drawer opener for mobile) */}
      <Box sx={{ width: '100%', maxWidth: 540, display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'space-between', pt: 1 }}>
        <IconButton onClick={onOpenMobileDrawer} size="small" sx={{ p: 0.8, bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}` }}>
          <MenuIcon size={20} />
        </IconButton>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '0.05em' }}>
          SHAADOW PLATFORMS
        </Typography>
      </Box>

      {/* ── SECTION 1: PRIMARY ACTION CARD (Room Creation & Joining) ── */}
      <Card
        elevation={0}
        sx={{
          maxWidth: 540,
          width: '100%',
          borderRadius: { xs: '20px', sm: '24px' },
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: mode === 'dark' ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 30px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
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

          {/* Main App Icon */}
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

          {/* Action 2: Join Input */}
          <Box
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleJoin(e);
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                },
              }}
            />
            <Button
              type="button"
              variant="outlined"
              onClick={handleJoin}
              disabled={joining || !joinInput.trim()}
              endIcon={<ArrowRight size={18} />}
              sx={{
                borderRadius: '12px',
                px: 2.5,
                py: { xs: 1, sm: 0 },
                whiteSpace: 'nowrap',
                fontWeight: 700,
              }}
            >
              {joining ? 'Checking...' : 'Join'}
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
        </CardContent>
      </Card>

      {/* ── SECTION 2: POWERED BY BOOFER HIGHLIGHT CARD ── */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: 540,
          width: '100%',
          p: { xs: 2.5, sm: 3 },
          borderRadius: '20px',
          bgcolor: mode === 'dark' ? 'rgba(0, 163, 255, 0.08)' : 'rgba(0, 163, 255, 0.05)',
          border: '1px solid rgba(0, 163, 255, 0.3)',
          boxShadow: '0 8px 24px rgba(0, 163, 255, 0.1)',
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.2, mb: 1.2 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em' }}>
            POWERED BY
          </Typography>
          <img
            src={`${BACKEND_URL}/public/images/boofer.png`}
            alt="Boofer"
            style={{ height: 24, objectFit: 'contain', filter: mode === 'dark' ? 'invert(1) brightness(2)' : 'none' }}
          />
        </Box>

        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary', mb: 2, lineHeight: 1.5, fontWeight: 500 }}>
          Experience fast, private & secure real-time messaging with Boofer. Download the official Android app on Google Play.
        </Typography>

        <Button
          component="a"
          href="https://play.google.com/store/apps/details?id=com.shaadow.boofer.android"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          size="medium"
          startIcon={<Download size={16} />}
          sx={{
            borderRadius: '12px',
            px: 3,
            py: 1,
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #00A3FF 0%, #0066FF 100%)',
            boxShadow: '0 4px 16px rgba(0, 163, 255, 0.35)',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.03)',
              background: 'linear-gradient(135deg, #0092E6 0%, #0052CC 100%)',
            },
          }}
        >
          Get Boofer on Google Play
        </Button>
      </Paper>

      {/* ── SECTION 3: SHAADOW PLATFORMS FOOTER & LEGAL CARD ── */}
      <Box
        component="footer"
        sx={{
          maxWidth: 540,
          width: '100%',
          color: 'text.secondary',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            borderRadius: '20px',
            bgcolor: mode === 'dark' ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Grid Section */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.2fr 1fr' }, gap: 3, mb: 2.5 }}>
            {/* Column 1: Shaadow Platforms */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ShieldCheck size={18} color={theme.palette.primary.main} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
                  Shaadow Platforms
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.45, mb: 1.5 }}>
                Engineering privacy-first, ephemeral communication tools and WebRTC peer-to-peer protocols.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                <Chip label="FAMN v2.5" size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: 'primary.main', color: '#fff' }} />
                <Chip
                  label="Boofer App"
                  size="small"
                  component="a"
                  href="https://play.google.com/store/apps/details?id=com.shaadow.boofer.android"
                  target="_blank"
                  clickable
                  sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: 'rgba(0, 163, 255, 0.15)', color: '#00A3FF' }}
                />
                <Chip label="PulseP2P Core" size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
              </Box>
            </Box>

            {/* Column 2: Ecosystem & Legal Links */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '0.08em', display: 'block', mb: 1.2 }}>
                LEGAL & SECURITY
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Button
                  size="small"
                  onClick={() => setLegalModal('privacy')}
                  startIcon={<Lock size={14} />}
                  sx={{ justifyContent: 'flex-start', p: 0, textTransform: 'none', color: 'text.secondary', fontSize: '0.78rem', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
                >
                  Privacy Policy & Zero-Logs
                </Button>

                <Button
                  size="small"
                  onClick={() => setLegalModal('terms')}
                  startIcon={<FileText size={14} />}
                  sx={{ justifyContent: 'flex-start', p: 0, textTransform: 'none', color: 'text.secondary', fontSize: '0.78rem', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
                >
                  Terms of Service
                </Button>

                <Button
                  size="small"
                  onClick={() => setLegalModal('security')}
                  startIcon={<ShieldCheck size={14} />}
                  sx={{ justifyContent: 'flex-start', p: 0, textTransform: 'none', color: 'text.secondary', fontSize: '0.78rem', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
                >
                  Security Specs & Protocols
                </Button>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Bottom Copyright Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
              © 2026 Shaadow Platforms. All rights reserved.
            </Typography>

            <Typography variant="caption" sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 600 }}>
              🔒 Ephemeral Memory Protocol
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* ── Legal & Security Dialog Modals ── */}
      <Dialog
        open={Boolean(legalModal)}
        onClose={() => setLegalModal(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            bgcolor: theme.palette.background.paper,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {legalModal === 'privacy' && <Lock size={20} color="#10B981" />}
            {legalModal === 'terms' && <FileText size={20} color="#6366F1" />}
            {legalModal === 'security' && <ShieldCheck size={20} color="#00A3FF" />}
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {legalModal === 'privacy' && 'Privacy Policy & Zero-Logs Policy'}
              {legalModal === 'terms' && 'Terms of Service'}
              {legalModal === 'security' && 'Security & Encryption Specs'}
            </Typography>
          </Box>
          <IconButton onClick={() => setLegalModal(null)} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: theme.palette.divider }}>
          {legalModal === 'privacy' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                1. Zero Data Retention Architecture
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Fun At Mid Night (FAMN) by Shaadow Platforms operates on a strict zero-retention ephemeral architecture. Messages exchanged during temporary chat sessions are retained exclusively in volatile RAM and WebRTC peer data channels.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                2. Immediate Destruction Upon Room Closure
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Once both users leave a chat room, or after a 5-minute empty room grace period, backend Redis keys and socket queues automatically destroy all message history. No chat transcripts are stored to persistent disks or external databases.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                3. No Registration & No Tracking
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Users do not register accounts, provide email addresses, or submit phone numbers. No persistent tracking cookies or third-party behavioral analytics scripts are embedded.
              </Typography>
            </Box>
          )}

          {legalModal === 'terms' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                1. Acceptance of Terms
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                By accessing or using Fun At Mid Night and Shaadow Platforms communication tools, you agree to comply with these terms and all applicable laws.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                2. Acceptable Use Policy
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                You agree not to use the platform to transmit unlawful material, perform malicious network disruption, or distribute illegal content. Shaadow Platforms reserves the right to terminate abusive rate-limited connections.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                3. Service Availability
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Services are provided on an "as-is" and "as-available" basis without warranties of uninterrupted availability.
              </Typography>
            </Box>
          )}

          {legalModal === 'security' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                1. WebRTC Peer-to-Peer Encryption
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Direct communication channels between room participants leverage WebRTC DTLS-SRTP end-to-end transport layer encryption.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                2. Temporary Session Keys
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Cryptographic session keys are generated dynamically per room session and discarded immediately upon termination.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                3. Automated Rate Limiting
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                API endpoints are protected by automated IP rate limiting and collision-free room ID verification.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" size="small" onClick={() => setLegalModal(null)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
