import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { getAppTheme } from './theme';
import { ChatProvider, useChat } from './context/ChatContext';
import { RoomSidebar } from './components/RoomSidebar';
import { RoomLanding } from './components/RoomLanding';
import { MinimalChatArea } from './components/MinimalChatArea';
import { QRCodeModal } from './components/Modals/QRCodeModal';
import { FileUploadModal } from './components/Modals/FileUploadModal';
import { CaptchaModal } from './components/Modals/CaptchaModal';
import { ProfileModal } from './components/Modals/ProfileModal';
import { ImageLightboxModal } from './components/Modals/ImageLightboxModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { LeaveRoomModal } from './components/Modals/LeaveRoomModal';

const AppLayout = () => {
  const { mode, roomId } = useChat();
  const theme = getAppTheme(mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}
      >
        {/* Desktop / Tablet Left Column Sidebar */}
        {!isMobile && <RoomSidebar />}

        {/* Mobile Left Drawer Overlay */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: 300,
                bgcolor: 'background.paper',
              },
            }}
          >
            <RoomSidebar onCloseMobileDrawer={() => setMobileDrawerOpen(false)} />
          </Drawer>
        )}

        {/* Main Workspace (Right Column) */}
        <Box sx={{
          flex: 1, display: 'flex', flexDirection: 'column',
          overflow: roomId ? 'hidden' : 'auto',
          width: '100%', height: '100%',
        }}>
          {roomId ? (
            <MinimalChatArea onOpenMobileDrawer={toggleMobileDrawer} />
          ) : (
            <RoomLanding onOpenMobileDrawer={toggleMobileDrawer} />
          )}
        </Box>

        {/* Modals */}
        <QRCodeModal />
        <FileUploadModal />
        <CaptchaModal />
        <ProfileModal />
        <ImageLightboxModal />
        <ShortcutsModal />
        <LeaveRoomModal />
      </Box>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <ChatProvider>
      <AppLayout />
    </ChatProvider>
  );
}
