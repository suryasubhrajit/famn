import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Paper,
  useTheme,
} from '@mui/material';
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Code,
  Package,
  File,
  Copy,
  Check,
  ShieldCheck,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const FileViewerModal = () => {
  const theme = useTheme();
  const { activeModal, setActiveModal, selectedFile, setSelectedFile, selectedImage, setSelectedImage, mode } = useChat();

  // Support both selectedFile object and legacy selectedImage string
  const currentFile = selectedFile || (selectedImage ? { url: selectedImage, name: 'Image Attachment', type: 'image' } : null);
  const open = (activeModal === 'lightbox' || activeModal === 'fileViewer') && Boolean(currentFile);

  // Viewer state
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imgDimensions, setImgDimensions] = useState(null);
  const [textContent, setTextContent] = useState(null);
  const [loadingText, setLoadingText] = useState(false);
  const [textFetchError, setTextFetchError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wrapLines, setWrapLines] = useState(true);
  const [fontSize, setFontSize] = useState(13);
  const [bgGrid, setBgGrid] = useState(true);

  // Detect file type & category
  const getFileCategory = () => {
    if (!currentFile) return 'generic';
    const url = (currentFile.url || '').toLowerCase();
    const name = (currentFile.name || '').toLowerCase();
    const ext = name.split('.').pop() || url.split('.').pop() || '';
    const type = (currentFile.type || '').toLowerCase();

    if (type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) {
      return 'image';
    }
    if (ext === 'pdf' || currentFile.mimetype === 'application/pdf') {
      return 'pdf';
    }
    if (type === 'video' || ['mp4', 'webm', 'ogg', 'mov', 'mkv'].includes(ext)) {
      return 'video';
    }
    if (type === 'audio' || ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) {
      return 'audio';
    }
    if (['txt', 'js', 'jsx', 'ts', 'tsx', 'json', 'py', 'html', 'css', 'scss', 'md', 'csv', 'xml', 'log', 'c', 'cpp', 'java', 'sh', 'yml', 'yaml', 'sql', 'env'].includes(ext)) {
      return 'text';
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return 'archive';
    }
    return 'generic';
  };

  const category = getFileCategory();

  // Reset controls when file changes
  useEffect(() => {
    if (open) {
      setZoom(1);
      setRotation(0);
      setImgDimensions(null);
      setTextContent(null);
      setTextFetchError(false);
      setCopied(false);

      if (category === 'text' && currentFile?.url) {
        setLoadingText(true);
        fetch(currentFile.url)
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch text file');
            return res.text();
          })
          .then((data) => {
            setTextContent(data);
            setLoadingText(false);
          })
          .catch(() => {
            setTextFetchError(true);
            setLoadingText(false);
          });
      }
    }
  }, [open, currentFile?.url, category]);

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedImage(null);
    setActiveModal(null);
  };

  const handleCopyText = () => {
    if (textContent) {
      navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // Icon mapping
  const renderIcon = () => {
    switch (category) {
      case 'image': return <ImageIcon size={18} color="#6366F1" />;
      case 'pdf': return <FileText size={18} color="#EF4444" />;
      case 'video': return <Film size={18} color="#10B981" />;
      case 'audio': return <Music size={18} color="#F59E0B" />;
      case 'text': return <Code size={18} color="#3B82F6" />;
      case 'archive': return <Package size={18} color="#8B5CF6" />;
      default: return <File size={18} color="#6B7280" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={category === 'pdf' || category === 'text' ? 'lg' : 'md'}
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: mode === 'dark' ? '#0F172A' : '#FFFFFF',
          color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        },
      }}
    >
      {/* ── Sandbox Header Bar ── */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: mode === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(248,250,252,0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        {/* Left: Icon, Filename & Meta Tag */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden', mr: 2 }}>
          {renderIcon()}
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ fontWeight: 700, fontSize: '0.9rem', maxWidth: { xs: 180, sm: 340 } }}
            >
              {currentFile?.name || 'Attachment'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.2 }}>
              <Chip
                label={category.toUpperCase()}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  bgcolor: 'rgba(99,102,241,0.12)',
                  color: '#6366F1',
                  borderRadius: '4px',
                }}
              />
              {currentFile?.size && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                  {currentFile.size}
                </Typography>
              )}
              {imgDimensions && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                  • {imgDimensions.width} × {imgDimensions.height} px
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Right: Sandbox Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          {/* Zoom controls for Image */}
          {category === 'image' && (
            <>
              <Tooltip title="Zoom Out">
                <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= 0.5}>
                  <ZoomOut size={18} />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" sx={{ minWidth: 36, textAlign: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                {Math.round(zoom * 100)}%
              </Typography>
              <Tooltip title="Zoom In">
                <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= 3}>
                  <ZoomIn size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rotate 90°">
                <IconButton size="small" onClick={handleRotate}>
                  <RotateCw size={18} />
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* Copy & Line wrap controls for Code/Text */}
          {category === 'text' && textContent && (
            <>
              <Tooltip title={wrapLines ? 'Disable Line Wrap' : 'Enable Line Wrap'}>
                <IconButton
                  size="small"
                  onClick={() => setWrapLines(!wrapLines)}
                  sx={{ color: wrapLines ? 'primary.main' : 'inherit' }}
                >
                  <Code size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy Raw Content">
                <IconButton size="small" onClick={handleCopyText}>
                  {copied ? <Check size={18} color="#10B981" /> : <Copy size={18} />}
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* Open in New Tab */}
          {currentFile?.url && (
            <Tooltip title="Open in New Tab">
              <IconButton
                component="a"
                href={currentFile.url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
              >
                <ExternalLink size={18} />
              </IconButton>
            </Tooltip>
          )}

          {/* Download File */}
          {currentFile?.url && (
            <Tooltip title="Download File">
              <IconButton
                component="a"
                href={currentFile.url}
                download={currentFile.name || 'download'}
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: '#FFF',
                  '&:hover': { bgcolor: 'primary.dark' },
                  ml: 0.5,
                }}
              >
                <Download size={17} />
              </IconButton>
            </Tooltip>
          )}

          {/* Close Modal */}
          <Tooltip title="Close Viewer">
            <IconButton onClick={handleClose} size="small" sx={{ ml: 0.5 }}>
              <X size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ── Sandbox Content Canvas ── */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: category === 'image' || category === 'pdf' || category === 'video' ? 0 : 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          minHeight: 360,
          bgcolor:
            category === 'image'
              ? mode === 'dark' ? '#070B14' : '#F1F5F9'
              : mode === 'dark' ? '#0F172A' : '#F8FAFC',
          position: 'relative',
        }}
      >
        {/* IMAGE PREVIEWER */}
        {category === 'image' && (
          <Box
            sx={{
              width: '100%',
              minHeight: '65vh',
              maxHeight: '78vh',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              overflow: 'auto',
              p: 2,
            }}
          >
            <img
              src={currentFile.url}
              alt={currentFile.name || 'Image'}
              onLoad={(e) => setImgDimensions({ width: e.target.naturalWidth, height: e.target.naturalHeight })}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '12px',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              }}
            />
          </Box>
        )}

        {/* PDF PREVIEWER */}
        {category === 'pdf' && (
          <Box sx={{ width: '100%', height: '78vh', bgcolor: '#1E293B' }}>
            <iframe
              src={`${currentFile.url}#toolbar=1`}
              title={currentFile.name || 'PDF Document'}
              width="100%"
              height="100%"
              style={{ border: 'none', display: 'block' }}
            />
          </Box>
        )}

        {/* VIDEO PREVIEWER */}
        {category === 'video' && (
          <Box
            sx={{
              width: '100%',
              maxHeight: '78vh',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              bgcolor: '#000000',
              p: 1,
            }}
          >
            <video
              controls
              autoPlay
              src={currentFile.url}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: '12px',
              }}
            />
          </Box>
        )}

        {/* AUDIO PREVIEWER */}
        {category === 'audio' && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              textAlign: 'center',
              maxWidth: 460,
              width: '100%',
              bgcolor: mode === 'dark' ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.9)',
              border: `1px solid ${theme.palette.divider}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'rgba(245,158,11,0.15)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                mx: 'auto',
                mb: 2,
                animation: 'pulseAudio 2s infinite ease-in-out',
                '@keyframes pulseAudio': {
                  '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(245,158,11,0.4)' },
                  '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 16px rgba(245,158,11,0)' },
                  '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(245,158,11,0)' },
                },
              }}
            >
              <Music size={32} color="#F59E0B" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {currentFile.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
              Audio Track • {currentFile.size || 'Voice / Audio File'}
            </Typography>
            <audio controls autoPlay src={currentFile.url} style={{ width: '100%', borderRadius: '8px' }} />
          </Paper>
        )}

        {/* TEXT & CODE PREVIEWER */}
        {category === 'text' && (
          <Box sx={{ width: '100%', height: '75vh', display: 'flex', flexDirection: 'column' }}>
            {loadingText ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
                <CircularProgress size={28} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Loading file content into sandbox...
                </Typography>
              </Box>
            ) : textFetchError ? (
              <Box sx={{ textAlign: 'center', my: 'auto', p: 3 }}>
                <Typography variant="subtitle1" color="error" sx={{ fontWeight: 700, mb: 1 }}>
                  Unable to load live text preview
                </Typography>
                <Button
                  variant="contained"
                  component="a"
                  href={currentFile.url}
                  download={currentFile.name}
                  startIcon={<Download size={16} />}
                >
                  Download File Instead
                </Button>
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  p: 2.5,
                  bgcolor: mode === 'dark' ? '#090D16' : '#F1F5F9',
                  borderRadius: '14px',
                  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.6,
                  color: mode === 'dark' ? '#E2E8F0' : '#1E293B',
                  whiteSpace: wrapLines ? 'pre-wrap' : 'pre',
                  wordBreak: 'break-word',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {textContent}
              </Paper>
            )}
          </Box>
        )}

        {/* GENERIC / ARCHIVE / DOCUMENT PREVIEWER */}
        {(category === 'generic' || category === 'archive') && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              textAlign: 'center',
              maxWidth: 480,
              width: '100%',
              bgcolor: mode === 'dark' ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.9)',
              border: `1px solid ${theme.palette.divider}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '24px',
                bgcolor: 'rgba(99,102,241,0.12)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                mx: 'auto',
                mb: 2.5,
              }}
            >
              {category === 'archive' ? <Package size={40} color="#8B5CF6" /> : <FileText size={40} color="#6366F1" />}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {currentFile.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              {currentFile.size ? `File Size: ${currentFile.size}` : 'Attachment File'}
            </Typography>

            <Box
              sx={{
                py: 1,
                px: 2,
                borderRadius: '10px',
                bgcolor: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
              }}
            >
              <ShieldCheck size={16} color="#10B981" />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#10B981', fontSize: '0.75rem' }}>
                Safe Sandbox File • Ephemeral Storage
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
              <Button
                variant="contained"
                component="a"
                href={currentFile.url}
                download={currentFile.name}
                startIcon={<Download size={18} />}
                sx={{ borderRadius: '12px', fontWeight: 700, px: 3 }}
              >
                Download File
              </Button>
              <Button
                variant="outlined"
                component="a"
                href={currentFile.url}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ExternalLink size={18} />}
                sx={{ borderRadius: '12px', fontWeight: 700 }}
              >
                Open Tab
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Dialog>
  );
};
