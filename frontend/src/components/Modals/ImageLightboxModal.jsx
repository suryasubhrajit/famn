import React from 'react';
import { Dialog, Box, IconButton, Tooltip } from '@mui/material';
import { X, Download } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const ImageLightboxModal = () => {
  const { activeModal, setActiveModal, selectedImage, setSelectedImage } = useChat();

  const open = activeModal === 'lightbox' && Boolean(selectedImage);

  const handleClose = () => {
    setSelectedImage(null);
    setActiveModal(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ position: 'relative', textAlign: 'center', p: 1 }}>
        {/* Controls Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1,
            zIndex: 10,
            bgcolor: 'rgba(0,0,0,0.6)',
            p: 0.5,
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Tooltip title="Download Image">
            <IconButton
              component="a"
              href={selectedImage}
              download="chat-shared-image.jpg"
              sx={{ color: '#FFF' }}
            >
              <Download size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Close View">
            <IconButton onClick={handleClose} sx={{ color: '#FFF' }}>
              <X size={20} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Full Image */}
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Shared Content"
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          />
        )}
      </Box>
    </Dialog>
  );
};
