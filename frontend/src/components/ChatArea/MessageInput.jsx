import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Popover,
  Typography,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Send, Paperclip, Smile, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const EMOJI_LIST = ['😀', '😂', '😍', '🔥', '👍', '🚀', '🎉', '❤️', '😎', '🙌', '💯', '✨', '💻', '☕', '⚡', '🛡️'];

export const MessageInput = () => {
  const theme = useTheme();
  const { sendMessage, activeRoom, typingUser, setActiveModal, mode } = useChat();
  const [text, setText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    setAnchorEl(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Direct preview handler
    const fileUrl = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');
    const isAudio = file.type.startsWith('audio/');

    sendMessage(`Shared a file: ${file.name}`, {
      type: isImage ? 'image' : isAudio ? 'audio' : 'document',
      name: file.name,
      url: fileUrl,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    });

    e.target.value = null;
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 2 },
        bgcolor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Typing Indicator Bar */}
      {typingUser && (
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
          <Sparkles size={14} color="#6366F1" />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            {typingUser} is typing...
          </Typography>
        </Box>
      )}

      {/* Input Paper Box */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: '4px 8px',
          borderRadius: '16px',
          bgcolor: theme.palette.background.subtle,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'border-color 0.2s ease',
          '&:focus-within': {
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {/* Attachment Options */}
        <Tooltip title="Upload Image / File">
          <IconButton size="small" onClick={() => fileInputRef.current?.click()} color="inherit">
            <Paperclip size={20} color={theme.palette.text.secondary} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Open File Dropzone Modal">
          <IconButton size="small" onClick={() => setActiveModal('fileUpload')} color="inherit">
            <ImageIcon size={20} color={theme.palette.text.secondary} />
          </IconButton>
        </Tooltip>

        {/* Emoji Button */}
        <Tooltip title="Add Emoji">
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            color="inherit"
          >
            <Smile size={20} color={theme.palette.text.secondary} />
          </IconButton>
        </Tooltip>

        {/* Text Input */}
        <InputBase
          fullWidth
          multiline
          maxRows={3}
          placeholder={`Message #${activeRoom.name}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          sx={{
            ml: 1.5,
            mr: 1,
            fontSize: '0.92rem',
            fontFamily: 'inherit',
          }}
        />

        {/* Send Button */}
        <IconButton
          onClick={handleSend}
          disabled={!text.trim()}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: text.trim()
              ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
              : 'transparent',
            color: text.trim() ? '#FFFFFF' : theme.palette.text.disabled,
            boxShadow: text.trim() ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: text.trim()
                ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                : 'transparent',
            },
          }}
        >
          <Send size={18} />
        </IconButton>
      </Paper>

      {/* Emoji Picker Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{
          sx: {
            p: 1.5,
            borderRadius: '16px',
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 240,
          },
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          {EMOJI_LIST.map((emoji) => (
            <Box
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              sx={{
                fontSize: '1.4rem',
                textAlign: 'center',
                cursor: 'pointer',
                p: 0.5,
                borderRadius: '8px',
                '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' },
              }}
            >
              {emoji}
            </Box>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};
