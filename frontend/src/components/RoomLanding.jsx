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
  MessageCircle,
  Eye,
  Clock,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const FeaturePill = ({ icon, label, mode }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.8,
      py: 0.7,
      px: 1.5,
      borderRadius: '100px',
      bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)',
      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(0,0,0,0.1)',
      backdropFilter: 'blur(8px)',
    }}
  >
    {icon}
    <Typography variant="caption" sx={{ fontWeight: 700, color: mode === 'dark' ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.72)', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
      {label}
    </Typography>
  </Box>
);

export const RoomLanding = ({ onOpenMobileDrawer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { createNewRoom, joinRoom, handle, mode, roomNoticeAlert, setRoomNoticeAlert } = useChat();
  const [joinInput, setJoinInput] = useState('');
  const [joining, setJoining] = useState(false);
  const [legalModal, setLegalModal] = useState(null);

  const handleJoin = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!joinInput.trim() || joining) return;
    setJoining(true);
    try { await joinRoom(joinInput.trim()); } finally { setJoining(false); }
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
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* ════════════════════════════════════════════════
          HERO SECTION – Full-width gradient with action
          ════════════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          px: { xs: 2, sm: 3, md: 6 },
          pt: { xs: 4, md: 6 },
          pb: { xs: 5, md: 7 },
          background: mode === 'dark'
            ? 'radial-gradient(ellipse 80% 70% at 50% -10%, rgba(99,102,241,0.3) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 50%, rgba(139,92,246,0.15) 0%, transparent 60%), #0B0F19'
            : 'radial-gradient(ellipse 80% 70% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 50%, rgba(139,92,246,0.1) 0%, transparent 60%), #F3F4F6',
        }}
      >
        {/* Decorative grid bg */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: `linear-gradient(${mode === 'dark' ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${mode === 'dark' ? '#fff' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />

        {/* Mobile hamburger */}
        {isMobile && (
          <IconButton
            onClick={onOpenMobileDrawer}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <MenuIcon size={20} />
          </IconButton>
        )}

        {/* ── Badge Tag ── */}
        <Chip
          icon={<Sparkles size={13} />}
          label="INSTANT EPHEMERAL CHAT · NO SIGNUP REQUIRED"
          size="small"
          sx={{
            mb: 3,
            px: 1.5,
            py: 2,
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.07em',
            bgcolor: 'rgba(99,102,241,0.15)',
            color: '#818CF8',
            border: '1px solid rgba(99,102,241,0.35)',
          }}
        />

        {/* ── Headline ── */}
        <Typography
          component="h1"
          sx={{
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            textAlign: 'center',
            mb: 2,
            fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
            color: mode === 'dark' ? '#fff' : '#0B0F19',
          }}
        >
          Private Chat.{' '}
          <Box component="span" sx={{
            background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            No Traces.
          </Box>
          <br />
          No Signup.
        </Typography>

        {/* ── Subtitle ── */}
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            maxWidth: 520,
            lineHeight: 1.65,
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
          }}
        >
          Instant 2-person rooms that self-destruct. Messages live only in{' '}
          <Box component="span" sx={{ fontWeight: 700, color: '#10B981' }}>volatile RAM</Box>
          {' '}— automatically erased when you leave.
        </Typography>

        {/* ── Feature Pills Row ── */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, justifyContent: 'center', mb: 4 }}>
          <FeaturePill icon={<Lock size={13} color="#10B981" />} label="Zero Data Storage" mode={mode} />
          <FeaturePill icon={<ShieldCheck size={13} color="#818CF8" />} label="WebRTC Encrypted" mode={mode} />
          <FeaturePill icon={<Clock size={13} color="#F59E0B" />} label="5-Min Auto Cleanup" mode={mode} />
          <FeaturePill icon={<Eye size={13} color="#EC4899" />} label="No Tracking, No Logs" mode={mode} />
        </Box>

        {/* ── THE ROOM ACTION CARD (Hero CTA) ── */}
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 500,
            borderRadius: '24px',
            border: mode === 'dark' ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(99,102,241,0.25)',
            background: mode === 'dark'
              ? 'rgba(17, 24, 39, 0.88)'
              : '#ffffff',
            backdropFilter: 'blur(24px)',
            boxShadow: mode === 'dark'
              ? '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.2) inset'
              : '0 8px 48px rgba(99,102,241,0.22), 0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {roomNoticeAlert && (
              <Alert
                severity="warning"
                onClose={() => setRoomNoticeAlert(null)}
                icon={<AlertCircle size={18} />}
                sx={{ mb: 3, borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem' }}
              >
                {roomNoticeAlert}
              </Alert>
            )}

            {/* Create Room Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={createNewRoom}
              startIcon={<Zap size={20} />}
              sx={{
                py: 1.8,
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                boxShadow: '0 8px 28px rgba(99,102,241,0.45)',
                mb: 2,
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 36px rgba(99,102,241,0.55)',
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                },
              }}
            >
              Create Instant Room & Get Link
            </Button>

            <Divider sx={{ my: 2, fontSize: '0.7rem', fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em' }}>
              OR JOIN EXISTING ROOM
            </Divider>

            {/* Join Row */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Paste room code…"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleJoin(e); } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                  },
                }}
              />
              <Button
                variant="outlined"
                onClick={handleJoin}
                disabled={joining || !joinInput.trim()}
                endIcon={<ArrowRight size={16} />}
                sx={{ borderRadius: '12px', px: 2.5, fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                {joining ? '...' : 'Join'}
              </Button>
            </Box>

            {/* Session hint */}
            <Box
              sx={{
                mt: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                p: 1.5,
                borderRadius: '12px',
                bgcolor: mode === 'dark' ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <Lock size={16} color="#10B981" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', display: 'block', fontSize: '0.75rem' }}>
                  Session: <Box component="span" sx={{ color: '#10B981' }}>{handle}</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.67rem' }}>
                  Auto-expires when room finishes
                </Typography>
              </Box>
              <Chip size="small" label="🔒 Protected" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 700, bgcolor: 'rgba(16,185,129,0.12)', color: '#10B981' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* ════════════════════════════════════════════════
          HOW IT WORKS — 3-step brief
          ════════════════════════════════════════════════ */}
      <Box
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 5, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          bgcolor: mode === 'dark' ? 'rgba(17,24,39,0.5)' : 'rgba(255,255,255,0.7)',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '0.12em', color: 'text.secondary', fontSize: '0.7rem' }}>
          HOW IT WORKS
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 3,
            width: '100%',
            maxWidth: 820,
          }}
        >
          {[
            {
              step: '01',
              icon: <Zap size={22} color="#6366F1" />,
              bg: 'rgba(99,102,241,0.12)',
              title: 'Create a Room',
              desc: 'Hit the button — you instantly get a private shareable room link. No forms.',
            },
            {
              step: '02',
              icon: <MessageCircle size={22} color="#10B981" />,
              bg: 'rgba(16,185,129,0.12)',
              title: 'Share & Connect',
              desc: 'Send the link to your contact. They join directly — no account needed.',
            },
            {
              step: '03',
              icon: <Eye size={22} color="#EC4899" />,
              bg: 'rgba(236,72,153,0.12)',
              title: 'Chat & Vanish',
              desc: 'Messages live only in RAM. Close the tab — everything is gone permanently.',
            },
          ].map(({ step, icon, bg, title, desc }) => (
            <Paper
              key={step}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '20px',
                bgcolor: mode === 'dark' ? 'rgba(17,24,39,0.7)' : '#fff',
                border: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: mode === 'dark' ? '0 12px 32px rgba(0,0,0,0.4)' : '0 12px 28px rgba(0,0,0,0.08)',
                },
              }}
            >
              <Typography
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 18,
                  fontWeight: 900,
                  fontSize: '2.5rem',
                  color: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                }}
              >
                {step}
              </Typography>

              <Box sx={{ p: 1.2, borderRadius: '12px', bgcolor: bg, display: 'inline-flex', mb: 2 }}>
                {icon}
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.8, color: 'text.primary' }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', lineHeight: 1.55 }}>
                {desc}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* ════════════════════════════════════════════════
          POWERED BY BOOFER — horizontal promo banner
          ════════════════════════════════════════════════ */}
      <Box
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 4, md: 5 },
          display: 'flex',
          justifyContent: 'center',
          bgcolor: theme.palette.background.default,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 820,
            p: { xs: 3, sm: 3.5 },
            borderRadius: '24px',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
            background: mode === 'dark'
              ? 'linear-gradient(135deg, rgba(0,103,255,0.12) 0%, rgba(0,163,255,0.08) 100%)'
              : 'linear-gradient(135deg, rgba(0,103,255,0.06) 0%, rgba(0,163,255,0.04) 100%)',
            border: '1px solid rgba(0,163,255,0.3)',
            boxShadow: '0 8px 28px rgba(0,163,255,0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, textAlign: { xs: 'center', sm: 'left' }, flexDirection: { xs: 'column', sm: 'row' } }}>
            <img
              src={`${BACKEND_URL}/public/images/boofer.png`}
              alt="Boofer"
              style={{
                height: 44,
                objectFit: 'contain',
                filter: mode === 'dark' ? 'invert(1) brightness(2)' : 'none',
              }}
            />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#00A3FF', letterSpacing: '0.1em', display: 'block', mb: 0.4 }}>
                POWERED BY BOOFER
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3, color: 'text.primary' }}>
                Experience private messaging on Android
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 0.3 }}>
                Download the official Boofer app — fast, private, zero-log communication.
              </Typography>
            </Box>
          </Box>

          <Button
            component="a"
            href="https://play.google.com/store/apps/details?id=com.shaadow.boofer.android"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            startIcon={<Download size={16} />}
            sx={{
              borderRadius: '14px',
              px: 3,
              py: 1.3,
              fontWeight: 700,
              fontSize: '0.88rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              background: 'linear-gradient(135deg, #00A3FF 0%, #0066FF 100%)',
              boxShadow: '0 6px 20px rgba(0,163,255,0.4)',
              '&:hover': {
                transform: 'scale(1.04)',
                background: 'linear-gradient(135deg, #0092E6 0%, #0052CC 100%)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Get Boofer on Google Play
          </Button>
        </Paper>
      </Box>

      {/* ════════════════════════════════════════════════
          FOOTER — Shaadow Platforms
          ════════════════════════════════════════════════ */}
      <Box
        component="footer"
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 4, md: 5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 3,
          bgcolor: mode === 'dark' ? 'rgba(11,15,25,0.9)' : 'rgba(243,244,246,0.9)',
          maxWidth: '100%',
        }}
      >
        {/* Left: Brand */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ShieldCheck size={18} color={theme.palette.primary.main} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Shaadow Platforms
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', display: 'block', mb: 1.5, maxWidth: 300 }}>
            Engineering privacy-first, ephemeral communication tools and WebRTC peer-to-peer protocols.
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
            <Chip label="FAMN v2.5" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'primary.main', color: '#fff' }} />
            <Chip
              label="Boofer App"
              size="small"
              component="a"
              href="https://play.google.com/store/apps/details?id=com.shaadow.boofer.android"
              target="_blank"
              clickable
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'rgba(0,163,255,0.15)', color: '#00A3FF' }}
            />
            <Chip label="PulseP2P Core" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }} />
          </Box>
        </Box>

        {/* Right: Legal Links */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.09em', color: 'text.secondary', display: 'block', mb: 1 }}>
            LEGAL & SECURITY
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
            {[
              { label: 'Privacy Policy & Zero-Logs', key: 'privacy', icon: <Lock size={13} /> },
              { label: 'Terms of Service', key: 'terms', icon: <FileText size={13} /> },
              { label: 'Security Specs & Protocols', key: 'security', icon: <ShieldCheck size={13} /> },
            ].map(({ label, key, icon }) => (
              <Button
                key={key}
                size="small"
                onClick={() => setLegalModal(key)}
                startIcon={icon}
                sx={{
                  justifyContent: 'flex-start',
                  p: 0,
                  textTransform: 'none',
                  color: 'text.secondary',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  minWidth: 0,
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Copyright strip */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          px: { xs: 2, md: 6 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          bgcolor: mode === 'dark' ? 'rgba(11,15,25,0.9)' : 'rgba(243,244,246,0.9)',
        }}
      >
        <Typography variant="caption" sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
          © 2026 Shaadow Platforms. All rights reserved.
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 600 }}>
          🔒 Volatile RAM Ephemeral Protocol
        </Typography>
      </Box>

      {/* ════════════════════════════════════════════════
          LEGAL DIALOGS
          ════════════════════════════════════════════════ */}
      <Dialog
        open={Boolean(legalModal)}
        onClose={() => setLegalModal(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', bgcolor: theme.palette.background.paper, p: 1 } }}
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
          <IconButton onClick={() => setLegalModal(null)} size="small"><X size={18} /></IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: theme.palette.divider }}>
          {legalModal === 'privacy' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>1. Zero Data Retention Architecture</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Fun At Mid Night (FAMN) by Shaadow Platforms operates on a strict zero-retention ephemeral architecture. Messages exchanged during temporary chat sessions are retained exclusively in volatile RAM and WebRTC peer data channels.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>2. Immediate Destruction Upon Room Closure</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Once both users leave a chat room, or after a 5-minute empty room grace period, backend Redis keys and socket queues automatically destroy all message history. No chat transcripts are stored to persistent disks or external databases.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>3. No Registration & No Tracking</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Users do not register accounts, provide email addresses, or submit phone numbers. No persistent tracking cookies or third-party behavioral analytics scripts are embedded.
              </Typography>
            </Box>
          )}
          {legalModal === 'terms' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>1. Acceptance of Terms</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                By accessing or using Fun At Mid Night and Shaadow Platforms communication tools, you agree to comply with these terms and all applicable laws.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>2. Acceptable Use Policy</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                You agree not to use the platform to transmit unlawful material, perform malicious network disruption, or distribute illegal content. Shaadow Platforms reserves the right to terminate abusive rate-limited connections.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>3. Service Availability</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Services are provided on an "as-is" and "as-available" basis without warranties of uninterrupted availability.
              </Typography>
            </Box>
          )}
          {legalModal === 'security' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>1. WebRTC Peer-to-Peer Encryption</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Direct communication channels between room participants leverage WebRTC DTLS-SRTP end-to-end transport layer encryption.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>2. Temporary Session Keys</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Cryptographic session keys are generated dynamically per room session and discarded immediately upon termination.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>3. Automated Rate Limiting</Typography>
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
