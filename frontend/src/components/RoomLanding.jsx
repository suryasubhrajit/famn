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
  Grid,
  useTheme,
  useMediaQuery,
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
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const RoomLanding = ({ onOpenMobileDrawer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
        p: { xs: 2, sm: 4, md: 5 },
        pb: { xs: 8, sm: 10 },
        bgcolor: theme.palette.background.default,
        gap: { xs: 3, md: 4 },
      }}
    >
      {/* ── TOP NAVIGATION BAR ── */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1100,
          p: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
          borderRadius: '20px',
          bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isMobile && (
            <IconButton onClick={onOpenMobileDrawer} size="small" sx={{ p: 0.8 }}>
              <MenuIcon size={20} />
            </IconButton>
          )}

          <img
            src={`${BACKEND_URL}/public/logo.svg?v=3`}
            alt="FAMN"
            style={{ width: 34, height: 34, borderRadius: '10px' }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.15rem' }, letterSpacing: '-0.02em' }}>
              Fun At Mid Night
            </Typography>
            <Chip
              label="P2P v2.5"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 800,
                bgcolor: 'rgba(99, 102, 241, 0.15)',
                color: 'primary.main',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: { xs: 'none', sm: 'inline-flex' },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<Lock size={12} color="#10B981" />}
            label="🟢 Ephemeral RAM Engine"
            size="small"
            sx={{
              height: 26,
              fontSize: '0.72rem',
              fontWeight: 700,
              bgcolor: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          />

          <Button
            component="a"
            href="https://play.google.com/store/apps/details?id=com.shaadow.boofer.android"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            startIcon={
              <img
                src={`${BACKEND_URL}/public/images/boofer.png`}
                alt="Boofer"
                style={{ height: 14, objectFit: 'contain', filter: 'invert(1) brightness(2)' }}
              />
            }
            sx={{
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              px: { xs: 1.2, sm: 1.8 },
              height: 32,
              background: 'linear-gradient(135deg, #00A3FF 0%, #0066FF 100%)',
              color: '#FFF',
              boxShadow: '0 4px 12px rgba(0, 163, 255, 0.3)',
            }}
          >
            {isMobile ? <Download size={14} /> : 'Get Boofer App'}
          </Button>
        </Box>
      </Paper>

      {/* ── HERO SPLIT-GRID SECTION ── */}
      <Box sx={{ width: '100%', maxWidth: 1100 }}>
        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
          {/* Left Column: Headline & Value Proposition */}
          <Grid item xs={12} md={6.5}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Chip
                icon={<Sparkles size={13} color="#818CF8" />}
                label="INSTANT 2-PERSON EPHEMERAL CHAT"
                size="small"
                sx={{
                  mb: 2,
                  px: 1,
                  py: 0.5,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                  color: 'primary.main',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
              />

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.6rem', md: '3.1rem' },
                }}
              >
                Connect Instantly.{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  Chat Privately.
                </Box>{' '}
                Zero Footprint.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.92rem', sm: '1.05rem' },
                  lineHeight: 1.6,
                  mb: 3.5,
                  maxWidth: 540,
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                Create instant 2-person chat rooms with no signups, no phone numbers, and no persistent logs. Messages exist strictly in volatile RAM and self-destruct when your session ends.
              </Typography>

              {/* Feature Chips Row */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mb: 3,
                }}
              >
                <Chip
                  icon={<CheckCircle2 size={14} color="#10B981" />}
                  label="Zero Data Storage"
                  sx={{ fontWeight: 700, fontSize: '0.78rem', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                />
                <Chip
                  icon={<CheckCircle2 size={14} color="#10B981" />}
                  label="WebRTC Peer Transport"
                  sx={{ fontWeight: 700, fontSize: '0.78rem', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                />
                <Chip
                  icon={<CheckCircle2 size={14} color="#10B981" />}
                  label="5-Min Grace Cleanup"
                  sx={{ fontWeight: 700, fontSize: '0.78rem', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                />
              </Box>

              {/* Stats Bar */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  px: 3,
                  borderRadius: '16px',
                  bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.5)' : 'rgba(255, 255, 255, 0.6)',
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: { xs: 2, sm: 4 },
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main', fontSize: '1.1rem' }}>
                    100%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', fontSize: '0.68rem' }}>
                    RAM Ephemeral
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#10B981', fontSize: '1.1rem' }}>
                    0
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', fontSize: '0.68rem' }}>
                    Accounts Needed
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#00A3FF', fontSize: '1.1rem' }}>
                    20 MB
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', fontSize: '0.68rem' }}>
                    File Transfer
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Right Column: Interactive Room Card */}
          <Grid item xs={12} md={5.5}>
            <Card
              elevation={0}
              sx={{
                width: '100%',
                borderRadius: '24px',
                bgcolor: theme.palette.background.paper,
                border: '1px solid rgba(99, 102, 241, 0.3)',
                boxShadow: mode === 'dark' ? '0 16px 48px rgba(0, 0, 0, 0.5)' : '0 16px 36px rgba(99, 102, 241, 0.12)',
                overflow: 'hidden',
                position: 'relative',
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

                {/* Card Title */}
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.01em' }}>
                  Start Temporary Chat Session
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontSize: '0.82rem' }}>
                  Generate an instant room link or enter a room code below.
                </Typography>

                {/* Action 1: Create Instant Room */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={createNewRoom}
                  startIcon={<Zap size={18} />}
                  sx={{
                    py: 1.5,
                    borderRadius: '14px',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)',
                    mb: 2.5,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    },
                  }}
                >
                  Create Instant Room & Get Link
                </Button>

                <Divider sx={{ my: 2.5, fontSize: '0.72rem', color: 'text.secondary', fontWeight: 700 }}>
                  OR JOIN AN EXISTING ROOM
                </Divider>

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
                      px: 2.8,
                      py: { xs: 1.1, sm: 0 },
                      whiteSpace: 'nowrap',
                      fontWeight: 700,
                    }}
                  >
                    {joining ? 'Checking...' : 'Join'}
                  </Button>
                </Box>

                {/* Session Box */}
                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    p: 1.8,
                    borderRadius: '14px',
                    bgcolor: theme.palette.background.subtle,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                        Auto-expires when room finishes
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    icon={<ShieldCheck size={12} color="#10B981" />}
                    label="Protected"
                    size="small"
                    sx={{ height: 22, fontSize: '0.65rem', fontWeight: 700, color: '#10B981', bgcolor: 'rgba(16, 185, 129, 0.1)' }}
                  />
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* ── FEATURE HIGHLIGHTS GRID (3 Cards) ── */}
      <Box sx={{ width: '100%', maxWidth: 1100, mt: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em', display: 'block', mb: 2, textAlign: 'center' }}>
          CORE SECURITY & PRIVACY FEATURES
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: '20px',
                bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'transform 0.25s ease',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: 'rgba(16, 185, 129, 0.15)', display: 'inline-flex', mb: 2 }}>
                <Lock size={22} color="#10B981" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                Volatile RAM Ephemeral Storage
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Chat messages live strictly in volatile memory during active sessions. When both users leave or room expires, memory structures are cleared permanently.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: '20px',
                bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'transform 0.25s ease',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: 'rgba(99, 102, 241, 0.15)', display: 'inline-flex', mb: 2 }}>
                <ShieldCheck size={22} color="#6366F1" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                WebRTC Peer Transport
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Direct peer-to-peer WebRTC DTLS-SRTP encryption streams messages, file attachments, and typing indicators with low latency.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: '20px',
                bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'transform 0.25s ease',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: 'rgba(0, 163, 255, 0.15)', display: 'inline-flex', mb: 2 }}>
                <Zap size={22} color="#00A3FF" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                Fast Sandbox File Transfer
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Share images, video clips, and documents up to 20MB directly in session viewer without persistent cloud drive uploads.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* ── POWERED BY BOOFER PROMINENT BANNER ── */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1100,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: '24px',
          bgcolor: mode === 'dark' ? 'rgba(0, 163, 255, 0.08)' : 'rgba(0, 163, 255, 0.04)',
          border: '1px solid rgba(0, 163, 255, 0.3)',
          boxShadow: '0 8px 28px rgba(0, 163, 255, 0.1)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, textAlign: { xs: 'center', sm: 'left' }, flexDirection: { xs: 'column', sm: 'row' } }}>
          <img
            src={`${BACKEND_URL}/public/images/boofer.png`}
            alt="Boofer"
            style={{ height: 38, objectFit: 'contain', filter: mode === 'dark' ? 'invert(1) brightness(2)' : 'none' }}
          />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#00A3FF', letterSpacing: '0.1em', display: 'block', mb: 0.3 }}>
              POWERED BY BOOFER ENGINE
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.3 }}>
              Experience fast, private & secure real-time messaging on Android.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 0.3 }}>
              Download the official Boofer app on Google Play Store.
            </Typography>
          </Box>
        </Box>

        <Button
          component="a"
          href="https://play.google.com/store/apps/details?id=com.shaadow.boofer.android"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          size="medium"
          startIcon={<Download size={16} />}
          sx={{
            borderRadius: '14px',
            px: 3.5,
            py: 1.2,
            fontWeight: 700,
            fontSize: '0.88rem',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            background: 'linear-gradient(135deg, #00A3FF 0%, #0066FF 100%)',
            boxShadow: '0 4px 16px rgba(0, 163, 255, 0.4)',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.04)',
              background: 'linear-gradient(135deg, #0092E6 0%, #0052CC 100%)',
            },
          }}
        >
          Get Boofer on Google Play
        </Button>
      </Paper>

      {/* ── SHAADOW PLATFORMS FOOTER ── */}
      <Box
        component="footer"
        sx={{
          width: '100%',
          maxWidth: 1100,
          color: 'text.secondary',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: '24px',
            bgcolor: mode === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Footer Grid */}
          <Grid container spacing={3} sx={{ mb: 2.5 }}>
            {/* Column 1: Shaadow Platforms */}
            <Grid item xs={12} sm={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ShieldCheck size={20} color={theme.palette.primary.main} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
                  Shaadow Platforms
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary', lineHeight: 1.5, mb: 2, maxWidth: 460 }}>
                Engineering privacy-first, ephemeral communication tools and WebRTC peer-to-peer protocols. Designed for secure, zero-log interactions.
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
            </Grid>

            {/* Column 2: Ecosystem & Legal Links */}
            <Grid item xs={12} sm={5}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '0.08em', display: 'block', mb: 1.2 }}>
                LEGAL & SECURITY SPECS
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Button
                  size="small"
                  onClick={() => setLegalModal('privacy')}
                  startIcon={<Lock size={14} />}
                  sx={{ justifyContent: 'flex-start', p: 0, textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
                >
                  Privacy Policy & Zero-Logs
                </Button>

                <Button
                  size="small"
                  onClick={() => setLegalModal('terms')}
                  startIcon={<FileText size={14} />}
                  sx={{ justifyContent: 'flex-start', p: 0, textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
                >
                  Terms of Service
                </Button>

                <Button
                  size="small"
                  onClick={() => setLegalModal('security')}
                  startIcon={<ShieldCheck size={14} />}
                  sx={{ justifyContent: 'flex-start', p: 0, textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem', fontWeight: 600, '&:hover': { color: 'primary.main' } }}
                >
                  Security Specs & Protocols
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Bottom Copyright Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              © 2026 Shaadow Platforms. All rights reserved.
            </Typography>

            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600 }}>
              🔒 Volatile RAM Ephemeral Protocol
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* ── LEGAL & SECURITY DIALOG MODALS ── */}
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
