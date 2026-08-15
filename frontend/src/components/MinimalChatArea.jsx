import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  InputBase,
  Popover,
  Alert,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Send,
  Paperclip,
  Smile,
  Copy,
  Download,
  FileText,
  X,
  Trash2,
  AlertCircle,
  Menu as MenuIcon,
  UserPlus,
  Lock,
  Plus,
  Reply,
  Clock,
  Keyboard,
  Eye,
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useChat } from '../context/ChatContext';

const DEFAULT_REACTIONS = ['👍', '❤️', '🔥', '😂'];

export const MinimalChatArea = ({ onOpenMobileDrawer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    messages,
    sendMessage,
    addReaction,
    deleteMessage,
    handle,
    hideSecurityBanner,
    setHideSecurityBanner,
    validateFile,
    uploadFileApi,
    fileErrorAlert,
    setFileErrorAlert,
    setSelectedImage,
    setActiveModal,
    typingUser,
    peers,
    copyInviteLink,
    copySuccess,
    mode,
    emitTyping,
    BACKEND_URL,
    leaveRoom,
    openFileViewer,
    downloadFileDirectly,
  } = useChat();

  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [activeMsgId, setActiveMsgId] = useState(null);
  const [lastDblClickedId, setLastDblClickedId] = useState(null);
  const [emojiPickerAnchor, setEmojiPickerAnchor] = useState(null);
  const [customReactionMsgId, setCustomReactionMsgId] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [soloCountdown, setSoloCountdown] = useState(60);

  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const typingTimerRef = useRef(null);

  // ── Solo countdown timer (60s) — auto fallback to landing if no 2nd user joins ──
  const canChat = peers.length >= 2;
  useEffect(() => {
    if (canChat) {
      // Reset timer whenever a 2nd person joins
      setSoloCountdown(60);
      return;
    }
    // Start countdown when alone in room
    setSoloCountdown(60);
    const interval = setInterval(() => {
      setSoloCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          leaveRoom();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [canChat]);

  // Desktop Keyboard Shortcuts (Ctrl+/, Ctrl+., Alt+A/Ctrl+Shift+U, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Focus Input Box: Ctrl + /  or  Cmd + /
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        textInputRef.current?.focus();
        return;
      }

      // 2. Toggle Emoji Picker: Ctrl + .  or  Alt + E
      if (((e.ctrlKey || e.metaKey) && e.key === '.') || (e.altKey && (e.key === 'e' || e.key === 'E'))) {
        e.preventDefault();
        setCustomReactionMsgId(null);
        setEmojiPickerAnchor((prev) => (prev ? null : fileInputRef.current));
        return;
      }

      // 3. Attach File: Ctrl + Shift + U  or  Alt + A  or  Ctrl + &
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'U' || e.key === 'u')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === '&' || e.key === '7'))
      ) {
        e.preventDefault();
        fileInputRef.current?.click();
        return;
      }

      // 4. Cancel Reply / Close Popovers: Escape
      if (e.key === 'Escape') {
        setReplyingTo(null);
        setActiveMsgId(null);
        setEmojiPickerAnchor(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // The other person in the room (not yourself)
  const partner = peers.find((p) => p.handle !== handle);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!text.trim() || !canChat) return;
    sendMessage(text, null, replyingTo);
    setText('');
    setReplyingTo(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Debounced typing indicator emit
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      emitTyping?.();
    }, 300);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFile(file)) { e.target.value = null; return; }

    try {
      setUploadingFile(true);
      // Upload file to backend and get a server-hosted URL accessible to all users
      const uploaded = await uploadFileApi(file);
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');

      // Build fileData with server URL (not blob URL)
      const fileData = {
        type: isImage ? 'image' : isVideo ? 'video' : isAudio ? 'audio' : 'document',
        name: file.name,
        url: uploaded.url.startsWith('http') ? uploaded.url : `${BACKEND_URL}${uploaded.url}`,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      };

      // Pass empty string for content — file attachment is the message
      sendMessage('', fileData, replyingTo);
    } catch (err) {
      // fileErrorAlert is already set by uploadFileApi
    } finally {
      setUploadingFile(false);
      e.target.value = null;
      setReplyingTo(null);
    }
  };

  const handleEmojiClick = (emojiData) => {
    if (customReactionMsgId) {
      addReaction(customReactionMsgId, emojiData.emoji);
      setCustomReactionMsgId(null);
    } else {
      setText((prev) => prev + emojiData.emoji);
    }
    setEmojiPickerAnchor(null);
  };

  const handleBubbleClick = (e, msg) => {
    e.stopPropagation();
    setActiveMsgId((prev) => (prev === msg.id ? null : msg.id));
  };

  const handleRowDblClick = (msg) => {
    if (!canChat) return;
    setActiveMsgId(null);
    setLastDblClickedId(msg.id);
    setTimeout(() => setLastDblClickedId(null), 500);
    setReplyingTo(msg);
  };

  // Dismiss context menu when clicking outside
  useEffect(() => {
    const dismiss = () => setActiveMsgId(null);
    document.addEventListener('click', dismiss);
    return () => document.removeEventListener('click', dismiss);
  }, []);

  const handleCustomReact = (e, msgId) => {
    e.stopPropagation();
    setCustomReactionMsgId(msgId);
    setEmojiPickerAnchor(e.currentTarget);
    setActiveMsgId(null);
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box
      sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%',
            bgcolor: theme.palette.background.default, overflow: 'hidden' }}
    >
      {/* ── Chat Header ── */}
      <Paper elevation={0} sx={{
        px: { xs: 1.2, sm: 3 }, py: 1,
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRadius: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0, flex: 1 }}>
          {isMobile && (
            <IconButton onClick={onOpenMobileDrawer} size="small" sx={{ p: 0.5 }}>
              <MenuIcon size={20} />
            </IconButton>
          )}

          {partner ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot" sx={{ '& .MuiBadge-badge': { backgroundColor: '#10B981', width: 9, height: 9 } }}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: partner.color || '#6366F1', fontSize: '0.85rem', fontWeight: 700 }}>
                  {partner.handle.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, fontSize: { xs: '0.88rem', sm: '1.02rem' }, lineHeight: 1.2, maxWidth: { xs: 100, sm: 200, md: 'none' } }}>
                  {partner.handle}
                </Typography>
                <Typography variant="caption" noWrap sx={{ color: '#10B981', fontSize: '0.68rem', fontWeight: 600, display: 'block' }}>
                  {typingUser === partner.handle ? 'typing…' : '🟢 Online'}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'background.subtle', color: 'text.secondary' }}>
                <Lock size={16} />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, fontSize: { xs: '0.88rem', sm: '1rem' }, lineHeight: 1.2, maxWidth: { xs: 110, sm: 200, md: 'none' } }}>
                  Nobody here yet
                </Typography>
                <Typography variant="caption" noWrap sx={{ color: 'text.secondary', fontSize: '0.68rem', display: 'block' }}>
                  Share room code to invite
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
          <Tooltip title="Keyboard Shortcuts (Ctrl+/)">
            <IconButton
              size="small"
              onClick={() => setActiveModal('shortcuts')}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                display: { xs: 'none', sm: 'inline-flex' },
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: 'primary.main', color: '#fff', transform: 'scale(1.08)' },
              }}
            >
              <Keyboard size={16} />
            </IconButton>
          </Tooltip>

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
              fontSize: '0.72rem',
              fontWeight: 700,
              height: 28,
              px: { xs: 0.8, sm: 1.2 },
              borderRadius: '10px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #00A3FF 0%, #0066FF 100%)',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0, 163, 255, 0.3)',
              transition: 'all 0.25s ease',
              '&:hover': {
                transform: 'scale(1.04)',
                background: 'linear-gradient(135deg, #0092E6 0%, #0052CC 100%)',
                boxShadow: '0 4px 14px rgba(0, 163, 255, 0.45)',
              },
            }}
          >
            {!isMobile && 'Get Boofer'}
          </Button>

          <Chip
            icon={<UserPlus size={13} color="#6366F1" />}
            label={copySuccess ? 'Copied!' : 'Invite'}
            size="small"
            onClick={copyInviteLink}
            sx={{
              fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', height: 28, px: 0.3,
              bgcolor: 'rgba(99,102,241,0.1)', color: 'primary.main',
              border: '1px solid rgba(99,102,241,0.3)',
              transition: 'all 0.25s ease',
              '&:hover': { transform: 'scale(1.04)', bgcolor: 'rgba(99,102,241,0.18)' },
            }}
          />
        </Box>
      </Paper>

      {/* ── File Error Alert ── */}
      {fileErrorAlert && (
        <Alert severity="error" onClose={() => setFileErrorAlert(null)}
          icon={<AlertCircle size={18} />}
          sx={{ borderRadius: 0, py: 0.5, px: 2, fontSize: '0.8rem', fontWeight: 600 }}>
          {fileErrorAlert}
        </Alert>
      )}

      {/* ── Fixed Watermark & Scrollable Chat Stream Outer Wrapper ── */}
      <Box sx={{
        flex: '1 1 0',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 0,
        bgcolor: theme.palette.background.default,
      }}>
        {/* FIXED 3x3 Tiled Boofer Watermark Wallpaper Matrix (Stays stationary when chat scrolls) */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            alignItems: 'center',
            justifyItems: 'center',
            p: 3,
            opacity: mode === 'dark' ? 0.035 : 0.05,
            filter: mode === 'dark' ? 'invert(1) brightness(1.8)' : 'grayscale(100%)',
          }}
        >
          {[...Array(9)].map((_, i) => (
            <img
              key={i}
              src={`${BACKEND_URL}/public/images/boofer.png`}
              alt="Boofer Tile"
              style={{ width: 150, maxWidth: '75%', height: 'auto', display: 'block' }}
            />
          ))}
        </Box>

        {/* Scrollable Message Stream Container (Scrolls independently over fixed watermark) */}
        <Box
          ref={scrollContainerRef}
          sx={{
          height: '100%',
          overflowY: 'auto',
          p: { xs: 1.5, sm: 3 },
          pb: { xs: '80px', sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Security Banner */}
          {!hideSecurityBanner && (
            <Paper elevation={0} sx={{
              p: 1.8, borderRadius: '14px', textAlign: 'center', position: 'relative', zIndex: 1,
              bgcolor: mode === 'dark' ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)',
              border: `1px solid ${theme.palette.divider}`, mx: 'auto', width: '100%',
              transition: 'all 0.3s ease',
            }}>
            <IconButton size="small" onClick={() => setHideSecurityBanner(true)}
              sx={{ position: 'absolute', top: 6, right: 6, color: 'text.secondary' }}>
              <X size={14} />
            </IconButton>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.3, fontSize: '0.85rem' }}>
              🔒 Private Temporary Session
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.3, fontSize: '0.72rem', px: 2 }}>
              All messages vanish when the session ends. Double-click any message row to reply.
            </Typography>
          </Paper>
        )}

        {/* ── Waiting for Partner Banner (shown when only 1 user is in room) ── */}
        {!canChat && (
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: '16px', textAlign: 'center', position: 'relative', zIndex: 1,
            bgcolor: mode === 'dark' ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.05)',
            border: `1px solid ${
              soloCountdown <= 10 ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.3)'
            }`,
            mx: 'auto', width: '100%',
            transition: 'border-color 0.5s ease',
            animation: 'fadeInWait 0.4s ease',
            '@keyframes fadeInWait': {
              '0%': { opacity: 0, transform: 'translateY(8px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Clock size={18} color={soloCountdown <= 10 ? '#EF4444' : '#F59E0B'} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: soloCountdown <= 10 ? '#EF4444' : '#F59E0B', fontSize: '0.9rem', transition: 'color 0.5s ease' }}>
                Waiting for your partner to join…
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4, fontSize: '0.75rem', mb: 1.5 }}>
              Share the invite link or QR code from the sidebar. Chat unlocks when both of you are in the room.
            </Typography>
            {/* Countdown ring + number */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
              <Box sx={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
                <svg width="48" height="48" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                  <circle
                    cx="24" cy="24" r="20"
                    fill="none"
                    stroke={soloCountdown <= 10 ? '#EF4444' : '#F59E0B'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - soloCountdown / 60)}`}
                    style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s ease' }}
                  />
                </svg>
                <Typography
                  sx={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.85rem',
                    color: soloCountdown <= 10 ? '#EF4444' : '#F59E0B',
                    transition: 'color 0.5s ease',
                  }}
                >
                  {soloCountdown}s
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem', textAlign: 'left' }}>
                {soloCountdown <= 10
                  ? '⚠️ Room closing soon! No one joined.'
                  : 'Room auto-closes if no one joins in time.'}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Messages */}
        {messages.map((msg) => {
          const isSelf = msg.sender?.handle === handle;
          const isActive = activeMsgId === msg.id;
          const isJustDblClicked = lastDblClickedId === msg.id;

          return (
            <Box key={msg.id}
              onDoubleClick={() => handleRowDblClick(msg)}
              sx={{
                display: 'flex', gap: 1,
                flexDirection: isSelf ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                cursor: 'default',
                userSelect: 'none',
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: isJustDblClicked ? 'rowDblClickPulse 0.4s ease' : 'none',
                '@keyframes rowDblClickPulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.015)', filter: 'brightness(1.15)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}>
              <Avatar sx={{
                width: { xs: 30, sm: 34 }, height: { xs: 30, sm: 34 },
                bgcolor: msg.sender?.color || '#6366F1', fontSize: '0.8rem', fontWeight: 700,
                flexShrink: 0,
                transition: 'transform 0.25s ease',
                '&:hover': { transform: 'scale(1.1)' },
              }}>
                {msg.sender?.handle ? msg.sender.handle.charAt(0).toUpperCase() : '?'}
              </Avatar>

              {/* Column: reaction pill → bubble → actions */}
              <Box sx={{
                maxWidth: { xs: '88%', sm: '75%' },
                display: 'flex', flexDirection: 'column',
                alignItems: isSelf ? 'flex-end' : 'flex-start',
                gap: 0,
              }}>
                {/* Sender label + time */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3,
                           justifyContent: isSelf ? 'flex-end' : 'flex-start' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                    {msg.sender?.handle}{isSelf && ' (You)'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                    {formatTime(msg.timestamp)}
                  </Typography>
                </Box>

                {/* ── Reaction Pill — ABOVE bubble ── */}
                {isActive && (
                  <Box sx={{ mb: 0.6, display: 'flex', justifyContent: isSelf ? 'flex-end' : 'flex-start' }}>
                    <Paper elevation={6} sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 0.6,
                      px: 1.4, py: 0.7, borderRadius: '24px',
                      bgcolor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      animation: 'springPopDown 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      '@keyframes springPopDown': {
                        '0%': { opacity: 0, transform: 'scale(0.8) translateY(-12px)' },
                        '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
                      },
                    }}>
                      {DEFAULT_REACTIONS.map((emoji) => (
                        <Typography key={emoji}
                          onClick={(e) => { e.stopPropagation(); addReaction(msg.id, emoji); setActiveMsgId(null); }}
                          sx={{ fontSize: '1.35rem', cursor: 'pointer', lineHeight: 1,
                                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                '&:hover': { transform: 'scale(1.4)' } }}>
                          {emoji}
                        </Typography>
                      ))}
                      <Tooltip title="More reactions">
                        <IconButton size="small" onClick={(e) => handleCustomReact(e, msg.id)}
                          sx={{ width: 28, height: 28,
                               bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                               transition: 'all 0.2s ease',
                               '&:hover': { bgcolor: 'primary.main', color: '#fff', transform: 'scale(1.1)' } }}>
                          <Plus size={14} />
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  </Box>
                )}

                {/* ── Chat Bubble ── */}
                <Paper elevation={0}
                  onClick={(e) => handleBubbleClick(e, msg)}
                  sx={{
                    p: { xs: 1.3, sm: 1.8 },
                    borderRadius: isSelf ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    bgcolor: isSelf ? 'primary.main' : theme.palette.background.paper,
                    color: isSelf ? '#fff' : 'text.primary',
                    border: isSelf ? 'none' : `1px solid ${theme.palette.divider}`,
                    boxShadow: isSelf ? '0 3px 12px rgba(99,102,241,0.25)' : '0 2px 6px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    outline: isActive ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                    outlineOffset: isActive ? '2px' : '0px',
                    transform: isActive ? 'scale(1.015)' : 'scale(1)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    userSelect: 'none',
                    '&:hover': {
                      boxShadow: isSelf ? '0 6px 18px rgba(99,102,241,0.35)' : '0 4px 12px rgba(0,0,0,0.08)',
                    },
                  }}>
                  {/* Quoted reply snippet */}
                  {msg.replyTo && (
                    <Box sx={{
                      p: 1, mb: 1, borderRadius: '8px',
                      borderLeft: `3px solid ${isSelf ? '#fff' : theme.palette.primary.main}`,
                      bgcolor: isSelf ? 'rgba(255,255,255,0.18)' : mode === 'dark' ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
                      transition: 'all 0.2s ease',
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, display: 'block',
                        color: isSelf ? '#fff' : 'primary.main', fontSize: '0.72rem' }}>
                        {msg.replyTo.handle}
                      </Typography>
                      <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', opacity: 0.9, display: 'block' }}>
                        {msg.replyTo.text}
                      </Typography>
                    </Box>
                  )}

                  {/* Text content */}
                  {msg.content && (
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {msg.content}
                    </Typography>
                  )}

                  {/* File attachment */}
                  {msg.file && (
                    <Box sx={{ mt: msg.content ? 1.2 : 0 }}>
                      {msg.file.type === 'image' ? (
                        <Box onClick={(e) => { e.stopPropagation(); openFileViewer(msg.file); }}
                          sx={{ borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', maxHeight: 260, transition: 'transform 0.25s ease', '&:hover': { transform: 'scale(1.01)' } }}>
                          <img src={msg.file.url} alt={msg.file.name}
                            style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block' }} />
                        </Box>
                      ) : msg.file.type === 'video' ? (
                        <Box
                          onClick={(e) => { e.stopPropagation(); openFileViewer(msg.file); }}
                          sx={{ borderRadius: '12px', overflow: 'hidden', maxHeight: 280, bgcolor: '#000', cursor: 'pointer', position: 'relative' }}
                        >
                          <video src={msg.file.url} style={{ width: '100%', maxHeight: 280, display: 'block', pointerEvents: 'none' }} />
                          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.3)' }}>
                            <Chip icon={<Eye size={14} color="#FFF" />} label="Click to view video sandbox" size="small" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: '#FFF', fontWeight: 700 }} />
                          </Box>
                        </Box>
                      ) : (
                        <Paper
                          elevation={0}
                          onClick={(e) => { e.stopPropagation(); openFileViewer(msg.file); }}
                          sx={{
                            p: 1.2, borderRadius: '10px',
                            bgcolor: isSelf ? 'rgba(255,255,255,0.15)' : theme.palette.background.subtle,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': { bgcolor: isSelf ? 'rgba(255,255,255,0.22)' : 'rgba(99,102,241,0.1)' },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                            <FileText size={22} color={isSelf ? '#fff' : theme.palette.primary.main} />
                            <Box sx={{ overflow: 'hidden' }}>
                              <Typography variant="caption" noWrap sx={{ fontWeight: 700, fontSize: '0.78rem', display: 'block' }}>
                                {msg.file.name}
                              </Typography>
                              <Typography variant="caption" sx={{ fontSize: '0.68rem', opacity: 0.8 }}>
                                {msg.file.size || 'Attachment'} • Click to view
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small"
                              onClick={(e) => { e.stopPropagation(); openFileViewer(msg.file); }}
                              sx={{ color: isSelf ? '#fff' : 'inherit' }}
                            >
                              <Eye size={16} />
                            </IconButton>
                            <IconButton size="small"
                              onClick={(e) => { e.stopPropagation(); downloadFileDirectly(msg.file.url, msg.file.name); }}
                              sx={{ color: isSelf ? '#fff' : 'inherit', transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.15)' } }}>
                              <Download size={16} />
                            </IconButton>
                          </Box>
                        </Paper>
                      )}
                    </Box>
                  )}
                </Paper>

                {/* Existing reaction badges */}
                {msg.reactions && Object.keys(msg.reactions).some((k) => msg.reactions[k] > 0) && (
                  <Box sx={{ display: 'flex', gap: 0.4, mt: 0.5, flexWrap: 'wrap',
                             justifyContent: isSelf ? 'flex-end' : 'flex-start' }}>
                    {Object.entries(msg.reactions).map(([emoji, count]) =>
                      count > 0 ? (
                        <Chip key={emoji} label={`${emoji} ${count}`} size="small"
                          onClick={() => addReaction(msg.id, emoji)}
                          sx={{ height: 20, fontSize: '0.68rem', cursor: 'pointer', transition: 'transform 0.18s ease', '&:hover': { transform: 'scale(1.1)' } }} />
                      ) : null
                    )}
                  </Box>
                )}

                {/* ── Action Buttons — BELOW bubble ── */}
                {isActive && (
                  <Paper elevation={6} onClick={(e) => e.stopPropagation()} sx={{
                    mt: 0.6,
                    display: 'inline-flex', flexDirection: 'column',
                    minWidth: 156, borderRadius: '14px', overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    bgcolor: theme.palette.background.paper,
                    animation: 'springSlideUp 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '@keyframes springSlideUp': {
                      '0%': { opacity: 0, transform: 'scale(0.92) translateY(12px)' },
                      '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
                    },
                  }}>
                    {/* Reply */}
                    <Box onClick={() => { setReplyingTo(msg); setActiveMsgId(null); }}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.2,
                           px: 1.8, py: 1, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                           transition: 'all 0.18s ease',
                           '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', pl: 2.5 } }}>
                      <Reply size={15} /> Reply
                    </Box>

                    {/* Copy */}
                    {msg.content && (
                      <Box onClick={() => { navigator.clipboard.writeText(msg.content); setActiveMsgId(null); }}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.2,
                             px: 1.8, py: 1, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                             transition: 'all 0.18s ease',
                             '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', pl: 2.5 } }}>
                        <Copy size={15} /> Copy Text
                      </Box>
                    )}

                    {/* Save file */}
                    {msg.file && (
                      <Box
                        onClick={() => { downloadFileDirectly(msg.file.url, msg.file.name); setActiveMsgId(null); }}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.2,
                             px: 1.8, py: 1, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                             textDecoration: 'none', color: 'inherit',
                             transition: 'all 0.18s ease',
                             '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', pl: 2.5 } }}>
                        <Download size={15} /> Save File
                      </Box>
                    )}

                    {/* Delete — only own messages */}
                    {isSelf && (
                      <Box onClick={() => { deleteMessage(msg.id); setActiveMsgId(null); }}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.2,
                             px: 1.8, py: 1, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                             color: '#EF4444', transition: 'all 0.18s ease',
                             '&:hover': { bgcolor: 'rgba(239,68,68,0.12)', pl: 2.5 } }}>
                        <Trash2 size={15} /> Delete
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            </Box>
          );
        })}

        </Box>
      </Box>

      {/* ── WhatsApp-Style Reply Preview Bar ── */}
      {replyingTo && (
        <Paper elevation={0} sx={{
          px: 2, py: 1,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          animation: 'slideUpReplyBar 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes slideUpReplyBar': {
            '0%': { opacity: 0, transform: 'translateY(14px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }}>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block' }}>
              Replying to {replyingTo.sender?.handle}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: 'text.secondary', display: 'block' }}>
              {replyingTo.content || replyingTo.file?.name || 'Attachment'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setReplyingTo(null)} sx={{ transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.15)' } }}>
            <X size={16} />
          </IconButton>
        </Paper>
      )}

      {/* ── Input Bar: position:fixed on mobile to escape overflow:hidden ancestors ── */}
      <Box sx={{
        position: { xs: 'fixed', md: 'relative' },
        bottom: { xs: 0, md: 'auto' },
        left: { xs: 0, md: 'auto' },
        right: { xs: 0, md: 'auto' },
        flexShrink: { md: 0 },
        p: { xs: '10px 12px', sm: '10px 16px', md: '10px 16px' },
        pb: { xs: 'calc(12px + env(safe-area-inset-bottom, 0px))', sm: '10px' },
        bgcolor: mode === 'dark' ? 'rgba(15, 20, 35, 0.97)' : 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: mode === 'dark'
          ? '0 -4px 20px rgba(0, 0, 0, 0.4)'
          : '0 -4px 20px rgba(99, 102, 241, 0.1)',
        zIndex: 1200,
        width: { xs: '100%', md: 'auto' },
      }}>
        {typingUser && (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic',
            display: 'block', mb: 0.5, px: 1, fontSize: '0.7rem' }}>
            {typingUser} is typing…
          </Typography>
        )}

        <Paper elevation={0} sx={{
          display: 'flex', alignItems: 'center',
          p: { xs: '3px 8px', sm: '4px 10px' },
          borderRadius: { xs: '20px', sm: '16px' },
          bgcolor: canChat ? theme.palette.background.subtle : (mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
          border: `1px solid ${canChat ? theme.palette.divider : 'rgba(245,158,11,0.3)'}`,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus-within': canChat ? { borderColor: 'primary.main', boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)' } : {},
          opacity: canChat ? 1 : 0.6,
        }}>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />

          <Tooltip title={canChat ? 'Attach file (max 20 MB)' : 'Wait for your partner to join'}>
            <span>
              <IconButton size="small" disabled={!canChat || uploadingFile}
                onClick={() => fileInputRef.current?.click()}
                sx={{ p: { xs: 0.5, sm: 1 }, transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.1)' } }}>
                <Paperclip size={18} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={canChat ? 'Insert emoji' : 'Wait for your partner to join'}>
            <span>
              <IconButton size="small" disabled={!canChat}
                onClick={(e) => { setCustomReactionMsgId(null); setEmojiPickerAnchor(e.currentTarget); }}
                sx={{ p: { xs: 0.5, sm: 1 }, transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.1)' } }}>
                <Smile size={18} />
              </IconButton>
            </span>
          </Tooltip>

          <InputBase fullWidth multiline maxRows={3}
            inputRef={textInputRef}
            placeholder={
              !canChat
                ? 'Waiting for partner…'
                : replyingTo
                  ? `Replying to ${replyingTo.sender?.handle}…`
                  : `Message ${partner ? partner.handle : 'room'}…`
            }
            disabled={!canChat}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyPress}
            sx={{ ml: 1, mr: 0.5, fontSize: { xs: '16px', sm: '0.9rem' } }}
          />

          <Tooltip title={!canChat ? 'Wait for your partner to join' : ''}>
            <span>
              <IconButton onClick={handleSend} disabled={!text.trim() || !canChat} sx={{
                width: { xs: 34, sm: 38 }, height: { xs: 34, sm: 38 },
                borderRadius: '12px', p: 0,
                bgcolor: text.trim() && canChat ? 'primary.main' : 'transparent',
                color: text.trim() && canChat ? '#fff' : 'text.disabled',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: text.trim() && canChat ? 'scale(1)' : 'scale(0.92)',
                '&:hover': { transform: text.trim() && canChat ? 'scale(1.08)' : 'scale(0.92)' },
              }}>
                <Send size={16} />
              </IconButton>
            </span>
          </Tooltip>
        </Paper>
      </Box>

      {/* ── Emoji Picker ── */}
      <Popover open={Boolean(emojiPickerAnchor)} anchorEl={emojiPickerAnchor}
        onClose={() => { setEmojiPickerAnchor(null); setCustomReactionMsgId(null); }}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <EmojiPicker onEmojiClick={handleEmojiClick} theme={mode} lazyLoadEmojis />
      </Popover>
    </Box>
  );
};
