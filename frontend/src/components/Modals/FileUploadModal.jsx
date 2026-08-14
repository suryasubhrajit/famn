import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import { UploadCloud, FileText, Image as ImageIcon, X, Check } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const FileUploadModal = () => {
  const theme = useTheme();
  const { activeModal, setActiveModal, sendMessage } = useChat();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const open = activeModal === 'fileUpload';

  const handleClose = () => {
    setSelectedFile(null);
    setUploading(false);
    setProgress(0);
    setActiveModal(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setUploading(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 25;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        const fileUrl = URL.createObjectURL(selectedFile);
        const isImage = selectedFile.type.startsWith('image/');
        const isAudio = selectedFile.type.startsWith('audio/');

        sendMessage(`Uploaded file: ${selectedFile.name}`, {
          type: isImage ? 'image' : isAudio ? 'audio' : 'document',
          name: selectedFile.name,
          url: fileUrl,
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        });

        handleClose();
      }
    }, 200);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Upload File to Channel
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Dropzone Box */}
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            p: 4,
            border: `2px dashed ${dragActive ? theme.palette.primary.main : theme.palette.divider}`,
            borderRadius: '16px',
            bgcolor: dragActive ? 'rgba(99, 102, 241, 0.08)' : theme.palette.background.subtle,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          component="label"
        >
          <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
          
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'rgba(99, 102, 241, 0.1)',
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <UploadCloud size={28} />
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Drag & drop your file here, or click to browse
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Supports Images (JPG, PNG, GIF), Documents (PDF, TXT), & Audio clips up to 25MB
          </Typography>
        </Box>

        {/* Selected File Card */}
        {selectedFile && (
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 2,
              borderRadius: '14px',
              bgcolor: theme.palette.background.subtle,
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {selectedFile.type.startsWith('image/') ? (
                <ImageIcon size={24} color={theme.palette.primary.main} />
              ) : (
                <FileText size={24} color={theme.palette.primary.main} />
              )}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </Box>
            </Box>

            <IconButton size="small" onClick={() => setSelectedFile(null)}>
              <X size={16} />
            </IconButton>
          </Paper>
        )}

        {/* Progress Bar */}
        {uploading && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Uploading... {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 4, height: 6 }} />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          startIcon={<Check size={18} />}
          sx={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            px: 3,
          }}
        >
          {uploading ? 'Processing...' : 'Share File'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
