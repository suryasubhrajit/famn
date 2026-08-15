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
  IconButton,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Lock,
  AlertCircle,
  FileText,
  Menu as MenuIcon,
  Download,
  Sparkles,
  MessageCircle,
  Eye,
  Clock,
  ExternalLink,
  CheckCircle2,
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

/* ════════════════════════════════════════════════════════════
   STANDALONE LEGAL PAGE VIEW (Privacy, Terms, Security Specs)
   ════════════════════════════════════════════════════════════ */
const LegalPageView = ({ pageKey, onBack, onSelectPage, mode }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: { xs: 2, sm: 4, md: 6 },
        pb: { xs: 8, md: 10 },
      }}
    >
      {/* Container */}
      <Box sx={{ width: '100%', maxWidth: 840 }}>
        {/* Top Back Navigation Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Button
            onClick={onBack}
            startIcon={<ArrowLeft size={18} />}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              px: 2.2,
              py: 0.8,
              fontWeight: 700,
              fontSize: '0.85rem',
              borderColor: theme.palette.divider,
              color: 'text.primary',
              '&:hover': {
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            Back to Home
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldCheck size={18} color={theme.palette.primary.main} />
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.08em' }}>
              SHAADOW PLATFORMS LEGAL & COMPLIANCE
            </Typography>
          </Box>
        </Box>

        {/* Hero Banner for Document */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: '24px',
            bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.7)' : '#FFFFFF',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: mode === 'dark' ? '0 16px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(0,0,0,0.05)',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '16px',
                bgcolor:
                  pageKey === 'privacy'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : pageKey === 'terms'
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'rgba(0, 163, 255, 0.15)',
                display: 'inline-flex',
              }}
            >
              {pageKey === 'privacy' && <Lock size={28} color="#10B981" />}
              {pageKey === 'terms' && <FileText size={28} color="#6366F1" />}
              {pageKey === 'security' && <ShieldCheck size={28} color="#00A3FF" />}
            </Box>

            <Box>
              <Chip
                label={
                  pageKey === 'privacy'
                    ? 'ZERO-LOGS GUARANTEE'
                    : pageKey === 'terms'
                    ? 'OFFICIAL TERMS'
                    : 'ENCRYPTION PROTOCOL'
                }
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  bgcolor:
                    pageKey === 'privacy'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : pageKey === 'terms'
                      ? 'rgba(99, 102, 241, 0.15)'
                      : 'rgba(0, 163, 255, 0.15)',
                  color:
                    pageKey === 'privacy'
                      ? '#10B981'
                      : pageKey === 'terms'
                      ? '#6366F1'
                      : '#00A3FF',
                  mb: 0.5,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', sm: '2rem' }, letterSpacing: '-0.02em' }}>
                {pageKey === 'privacy' && 'Privacy Policy & Zero-Logs Specification'}
                {pageKey === 'terms' && 'Terms of Service & Usage Policy'}
                {pageKey === 'security' && 'Security Specs & Architecture Protocols'}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
            Effective Date: 2026 • Official Ephemeral Protocol Specification by Shaadow Platforms.
          </Typography>
        </Paper>

        {/* Detailed Document Content Body */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: '24px',
            bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : '#FFFFFF',
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            mb: 4,
          }}
        >
          {pageKey === 'privacy' && (
            <>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  1. Zero Data Retention Architecture
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  Fun At Mid Night (FAMN) by Shaadow Platforms operates on a strict zero-retention ephemeral memory architecture. Messages exchanged during temporary chat sessions are retained exclusively in volatile RAM and WebRTC peer data channels. No message logs, chat histories, or file attachments are stored to persistent hard disks or external databases.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  2. Automated Ephemeral Destruction
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem', mb: 1.5 }}>
                  Once both users leave a chat room, or after a 5-minute empty room grace period, backend Redis keys and socket memory queues automatically purge all message history permanently.
                </Typography>
                <Box sx={{ p: 2, borderRadius: '14px', bgcolor: mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle2 size={16} /> Guaranteed Non-Recoverability
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block', lineHeight: 1.5 }}>
                    After room deletion, chat data cannot be recovered by server administrators, third parties, or law enforcement, as memory structures are completely overwritten in RAM.
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  3. No User Registration & Zero Tracker Cookies
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  Users access FAMN without registering accounts, supplying email addresses, or providing phone numbers. Session handles are generated dynamically and disappear when your browser tab closes. No persistent tracking cookies or third-party behavioral analytics scripts are embedded into our client application.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  4. Peer-to-Peer Media Direct Streaming
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  Photos, video clips, and document attachments are transmitted directly between connected browsers via WebRTC peer data channels whenever possible. Temporary fallback server buffers are capped at 20MB and cleared immediately after peer transfer completes.
                </Typography>
              </Box>
            </>
          )}

          {pageKey === 'terms' && (
            <>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  1. Acceptance of Ephemeral Terms
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  By accessing or using Fun At Mid Night (FAMN) and Shaadow Platforms communication tools, you acknowledge and agree to comply with these Terms of Service. If you do not agree to these terms, please refrain from using our services.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  2. Acceptable Conduct & Prohibited Activities
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem', mb: 1.5 }}>
                  You agree to use FAMN strictly for lawful communication. You are explicitly prohibited from engaging in:
                </Typography>
                <Box component="ul" sx={{ color: 'text.secondary', fontSize: '0.9rem', pl: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <li>Transmitting illegal, violent, or abusive material.</li>
                  <li>Executing automated denial-of-service (DDoS) attacks or socket flood scripts against our signaling servers.</li>
                  <li>Attempting to bypass automated rate-limiting algorithms or collision-free room ID verification protocols.</li>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  3. Transience of Data & No Recovery Guarantee
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  FAMN chat rooms are temporary by design. Shaadow Platforms provides no storage, archive, or data recovery services for expired chat rooms. Once a room closes, all associated content is permanently destroyed without backup.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  4. Service Availability & Limitation of Liability
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  Shaadow Platforms provides services on an "AS IS" and "AS AVAILABLE" basis without warranties of uninterrupted operation or guaranteed uptime. Shaadow Platforms is not liable for data lost due to network disconnections or room expiration timeouts.
                </Typography>
              </Box>
            </>
          )}

          {pageKey === 'security' && (
            <>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  1. WebRTC DTLS-SRTP Transport Encryption
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  Direct peer-to-peer data channels established between participants leverage WebRTC Datagram Transport Layer Security (DTLS) and Secure Real-time Transport Protocol (SRTP). This ensures end-to-end transport layer privacy for chat messages and media streams.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  2. Dynamic Cryptographic Room Identifiers
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  Room codes (e.g. `tsy-cusn-bti`) are generated using cryptographically strong random token generators with zero-collision key spaces. Rooms are strictly capped at 2 participants to prevent unauthorized eavesdropping.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  3. Automated Rate Limiting & Anti-Abuse Filters
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  Signaling gateways enforce strict per-IP connection limits, room creation rate throttling, and payload size bounds (maximum 20MB per file chunk). Socket connections exceeding safe rate thresholds are automatically disconnected.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  4. Ephemeral Infrastructure Isolation
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  Our backend signaling microservices operate inside isolated RAM containers without access to persistent block storage devices. Memory buffers are continuously overwritten to ensure total zero-disk footprints.
                </Typography>
              </Box>
            </>
          )}
        </Paper>

        {/* Bottom Switcher Tabs */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '20px',
            bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.7)' : '#FFFFFF',
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.08em' }}>
            OTHER LEGAL & COMPLIANCE PAGES:
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant={pageKey === 'privacy' ? 'contained' : 'outlined'}
              onClick={() => onSelectPage('privacy')}
              startIcon={<Lock size={14} />}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
            >
              Privacy Policy
            </Button>

            <Button
              size="small"
              variant={pageKey === 'terms' ? 'contained' : 'outlined'}
              onClick={() => onSelectPage('terms')}
              startIcon={<FileText size={14} />}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
            >
              Terms of Service
            </Button>

            <Button
              size="small"
              variant={pageKey === 'security' ? 'contained' : 'outlined'}
              onClick={() => onSelectPage('security')}
              startIcon={<ShieldCheck size={14} />}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
            >
              Security Specs
            </Button>
          </Box>
        </Paper>

        {/* Footer info */}
        <Box sx={{ textAlign: 'center', mt: 4, mb: { xs: 12, sm: 4 } }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 600 }}>
            © 2026 Shaadow Platforms. All rights reserved. • 🔒 Ephemeral Memory Protocol
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const RoomLanding = ({ onOpenMobileDrawer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { createNewRoom, joinRoom, handle, mode, roomNoticeAlert, setRoomNoticeAlert } = useChat();
  const [joinInput, setJoinInput] = useState('');
  const [joining, setJoining] = useState(false);
  const [activeLegalPage, setActiveLegalPage] = useState(null); // 'privacy' | 'terms' | 'security' | null

  const handleJoin = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!joinInput.trim() || joining) return;
    setJoining(true);
    try { await joinRoom(joinInput.trim()); } finally { setJoining(false); }
  };

  // Render standalone Legal Page if selected
  if (activeLegalPage) {
    return (
      <LegalPageView
        pageKey={activeLegalPage}
        onBack={() => setActiveLegalPage(null)}
        onSelectPage={(newKey) => setActiveLegalPage(newKey)}
        mode={mode}
      />
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
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
          pt: { xs: 4, sm: 6, md: 7 },
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

        {/* ── Badge Tag (Hidden on mobile to save vertical space) ── */}
        <Chip
          icon={<Sparkles size={13} />}
          label="INSTANT EPHEMERAL CHAT · NO SIGNUP REQUIRED"
          size="small"
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
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
                fontSize: { xs: '0.92rem', sm: '1rem' },
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
              Create Instant Room
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
          px: { xs: 2.5, sm: 4, md: 6 },
          py: { xs: 4, md: 5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          justifyContent: 'space-between',
          textAlign: { xs: 'center', sm: 'left' },
          gap: 3.5,
          bgcolor: mode === 'dark' ? 'rgba(11,15,25,0.9)' : 'rgba(243,244,246,0.9)',
          maxWidth: '100%',
        }}
      >
        {/* Left: Brand */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, mb: 1 }}>
            <ShieldCheck size={18} color={theme.palette.primary.main} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Shaadow Platforms
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem', display: 'block', mb: 1.8, maxWidth: 340, textAlign: { xs: 'center', sm: 'left' } }}>
            Engineering privacy-first, ephemeral communication tools and WebRTC peer-to-peer protocols.
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Chip label="FAMN v2.5" size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: 'primary.main', color: '#fff' }} />
            <Chip
              label="Boofer App"
              size="small"
              component="a"
              href="https://play.google.com/store/apps/details?id=com.shaadow.boofer.android"
              target="_blank"
              clickable
              sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: 'rgba(0,163,255,0.15)', color: '#00A3FF' }}
            />
            <Chip label="PulseP2P Core" size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }} />
          </Box>
        </Box>

        {/* Right: Legal Links */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.09em', color: 'text.secondary', display: 'block', mb: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            LEGAL & SECURITY
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, alignItems: { xs: 'center', sm: 'flex-start' } }}>
            {[
              { label: 'Privacy Policy & Zero-Logs', key: 'privacy', icon: <Lock size={14} /> },
              { label: 'Terms of Service', key: 'terms', icon: <FileText size={14} /> },
              { label: 'Security Specs & Protocols', key: 'security', icon: <ShieldCheck size={14} /> },
            ].map(({ label, key, icon }) => (
              <Button
                key={key}
                size="small"
                onClick={() => setActiveLegalPage(key)}
                startIcon={icon}
                sx={{
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  px: 1.8,
                  py: 0.8,
                  borderRadius: '10px',
                  textTransform: 'none',
                  color: 'text.secondary',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  minWidth: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                  },
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
          px: { xs: 2.5, md: 6 },
          py: 3,
          pb: { xs: 'calc(40px + env(safe-area-inset-bottom, 0px))', sm: 3 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'space-between' },
          textAlign: 'center',
          gap: 1.5,
          bgcolor: mode === 'dark' ? 'rgba(11,15,25,0.9)' : 'rgba(243,244,246,0.9)',
        }}
      >
        <Typography variant="caption" sx={{ fontSize: '0.78rem', color: 'text.secondary', fontWeight: 600, textAlign: 'center' }}>
          © 2026 Shaadow Platforms. All rights reserved.
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.78rem', color: 'text.secondary', fontWeight: 700, textAlign: 'center' }}>
          🔒 Volatile RAM Ephemeral Protocol
        </Typography>
      </Box>

      {/* Dedicated Extra Bottom Spacer Box for Mobile Browser Navigation Bars */}
      <Box sx={{ height: { xs: 90, sm: 0 }, width: '100%', flexShrink: 0, bgcolor: mode === 'dark' ? 'rgba(11,15,25,0.9)' : 'rgba(243,244,246,0.9)' }} />
    </Box>
  );
};
