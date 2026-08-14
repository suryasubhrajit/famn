import React, { useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  FileText,
  Download,
  Image as ImageIcon,
  Heart,
  ThumbsUp,
  Flame,
  Smile,
  CheckCheck,
  Music,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const QUICK_EMOJIS = ['👍', '❤️', '🔥', '😂', '😍', '🚀'];

export const MessageList = () => {
  const theme = useTheme();
  const { messages, activeRoom, username, addReaction, setSelectedImage, setActiveModal, mode } = useChat();
  const messagesEndRef = useRef(null);

  const roomMessages = messages.filter((m) => !m.roomId || m.roomId === activeRoom.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeRoom]);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        p: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Room Welcome Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '16px',
          bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.05)',
          border: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
          mb: 1,
        }}
      >
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          {activeRoom.icon} Welcome to #{activeRoom.name}!
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxW: 500, mx: 'auto' }}>
          This is the start of the #{activeRoom.name} channel. Feel free to chat, share images, documents, audio clips, and code snippets!
        </Typography>
      </Paper>

      {/* Message Items */}
      {roomMessages.map((msg) => {
        const isSelf = msg.sender?.name === username;

        return (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              gap: 1.5,
              flexDirection: isSelf ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
            }}
          >
            {/* Avatar */}
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: msg.sender?.color || '#6366F1',
                fontSize: '0.9rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>

            {/* Bubble Container */}
            <Box sx={{ maxWidth: { xs: '85%', sm: '70%' } }}>
              {/* Header Meta */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 0.4,
                  justifyContent: isSelf ? 'flex-end' : 'flex-start',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {msg.sender?.name}
                </Typography>
                {msg.sender?.isBot && (
                  <Chip
                    icon={<Sparkles size={10} color="#FFF" />}
                    label="BOT"
                    size="small"
                    sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#6366F1', color: '#FFF' }}
                  />
                )}
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  {formatTime(msg.timestamp)}
                </Typography>
              </Box>

              {/* Message Paper Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 1.8,
                  borderRadius: isSelf ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                  bgcolor: isSelf
                    ? theme.palette.primary.main
                    : theme.palette.background.paper,
                  color: isSelf ? '#FFFFFF' : 'text.primary',
                  border: isSelf ? 'none' : `1px solid ${theme.palette.divider}`,
                  boxShadow: isSelf
                    ? '0 4px 14px rgba(99, 102, 241, 0.3)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {/* Text Content */}
                {msg.content && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.92rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </Typography>
                )}

                {/* File Attachment Card */}
                {msg.file && (
                  <Box sx={{ mt: msg.content ? 1.5 : 0 }}>
                    {msg.file.type === 'image' ? (
                      <Box
                        onClick={() => {
                          setSelectedImage(msg.file.url);
                          setActiveModal('lightbox');
                        }}
                        sx={{
                          position: 'relative',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          maxHeight: 280,
                          '&:hover img': { transform: 'scale(1.03)' },
                        }}
                      >
                        <img
                          src={msg.file.url}
                          alt={msg.file.name}
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 280,
                            objectFit: 'cover',
                            borderRadius: '12px',
                            display: 'block',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </Box>
                    ) : msg.file.type === 'audio' ? (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.2,
                          borderRadius: '12px',
                          bgcolor: isSelf ? 'rgba(255,255,255,0.15)' : theme.palette.background.subtle,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <Music size={24} color={isSelf ? '#FFF' : theme.palette.primary.main} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                            {msg.file.name}
                          </Typography>
                          <audio controls src={msg.file.url} style={{ height: 28, width: '100%', marginTop: 4 }} />
                        </Box>
                      </Paper>
                    ) : (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: '12px',
                          bgcolor: isSelf ? 'rgba(255,255,255,0.15)' : theme.palette.background.subtle,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1.5,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <FileText size={22} color={isSelf ? '#FFF' : theme.palette.primary.main} />
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                              {msg.file.name}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                              {msg.file.size || 'Attachment'}
                            </Typography>
                          </Box>
                        </Box>
                        <Tooltip title="Download Attachment">
                          <IconButton
                            size="small"
                            component="a"
                            href={msg.file.url}
                            download={msg.file.name}
                            sx={{ color: isSelf ? '#FFF' : 'inherit' }}
                          >
                            <Download size={18} />
                          </IconButton>
                        </Tooltip>
                      </Paper>
                    )}
                  </Box>
                )}
              </Paper>

              {/* Reaction Badges & Quick Picker */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.5,
                  flexWrap: 'wrap',
                  justifyContent: isSelf ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Existing Reactions */}
                {msg.reactions &&
                  Object.entries(msg.reactions).map(([emoji, count]) =>
                    count > 0 ? (
                      <Chip
                        key={emoji}
                        label={`${emoji} ${count}`}
                        size="small"
                        onClick={() => addReaction(msg.id, emoji)}
                        sx={{
                          height: 22,
                          fontSize: '0.72rem',
                          bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                          border: `1px solid ${theme.palette.divider}`,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' },
                        }}
                      />
                    ) : null
                  )}

                {/* Quick Emoji Bar */}
                <Box
                  className="quick-emojis"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.3,
                    opacity: 0.7,
                    '&:hover': { opacity: 1 },
                  }}
                >
                  {QUICK_EMOJIS.slice(0, 3).map((emoji) => (
                    <Typography
                      key={emoji}
                      variant="caption"
                      onClick={() => addReaction(msg.id, emoji)}
                      sx={{
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        p: '2px 4px',
                        borderRadius: '4px',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      {emoji}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}

      <div ref={messagesEndRef} />
    </Box>
  );
};
