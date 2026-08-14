import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const ChatContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Strict 3-4-3 letter validation for Google Meet style room IDs (e.g. "tsy-cusn-bti")
export const isValidRoomId = (code) => {
  if (!code || typeof code !== 'string') return false;
  const clean = code.trim().toLowerCase();
  const parts = clean.split('-');
  if (parts.length !== 3) return false;
  return (
    parts[0].length === 3 && /^[a-z]{3}$/.test(parts[0]) &&
    parts[1].length === 4 && /^[a-z]{4}$/.test(parts[1]) &&
    parts[2].length === 3 && /^[a-z]{3}$/.test(parts[2])
  );
};

export const ChatProvider = ({ children }) => {
  // Session Profile
  const [handle, setHandleState] = useState(() => sessionStorage.getItem('p2p_handle') || '');
  const [avatarColor, setAvatarColor] = useState(() => sessionStorage.getItem('p2p_color') || '#6366F1');

  // Room State (Parse Google Meet style room code from path e.g. /tsy-cusn-bti or query param)
  const [roomId, setRoomId] = useState(() => {
    const pathCode = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
    if (pathCode && isValidRoomId(pathCode)) {
      return pathCode;
    }
    const params = new URLSearchParams(window.location.search);
    const queryCode = (params.get('room') || '').trim().toLowerCase();
    if (queryCode && isValidRoomId(queryCode)) {
      return queryCode;
    }
    return null;
  });

  // Room notice alert (e.g. "Room expired" or "Invalid format")
  const [roomNoticeAlert, setRoomNoticeAlert] = useState(null);

  // Ref to always have latest roomId inside socket callbacks (avoids stale closure)
  const roomIdRef = useRef(roomId);
  useEffect(() => { roomIdRef.current = roomId; }, [roomId]);

  const [roomTTL, setRoomTTLState] = useState('1h');
  const [hideSecurityBanner, setHideSecurityBanner] = useState(false);

  // Connection & Offline Monitor
  const [isConnected, setIsConnected] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(true);
  const [captchaToken] = useState('recaptcha-verified-token');

  // Chat Data & Peers
  const [messages, setMessages] = useState([]);
  const [peers, setPeers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  // File Upload & Validation Alert
  const [fileErrorAlert, setFileErrorAlert] = useState(null);

  // UI Modals & Theme
  const [mode, setMode] = useState(() => localStorage.getItem('famn_theme') || 'light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // ── Verify Room Existence & Format on Mount or Direct Navigation ───────────
  useEffect(() => {
    const pathCode = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
    
    // Direct URL check: If user pasted an ill-formatted code in Chrome URL bar
    if (pathCode && !isValidRoomId(pathCode)) {
      console.warn(`[URL Validator] Invalid room code format: "${pathCode}"`);
      setRoomNoticeAlert(`Room link "#${pathCode}" is invalid. Room codes must be 3 letters, 4 letters, and 3 letters separated by hyphens (e.g. tsy-cusn-bti).`);
      window.history.replaceState(null, '', '/');
      setRoomId(null);
      setMessages([]);
      setPeers([]);
      return;
    }

    if (!roomId) return;

    if (!isValidRoomId(roomId)) {
      setRoomNoticeAlert(`Room code "#${roomId}" is invalid. Room codes must be formatted like tsy-cusn-bti.`);
      window.history.replaceState(null, '', '/');
      setRoomId(null);
      setMessages([]);
      setPeers([]);
      return;
    }

    fetch(`${BACKEND_URL}/api/rooms/${roomId}/exists`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.exists) {
          console.warn(`[Room Check] Room ${roomId} does not exist or has expired.`);
          setRoomNoticeAlert(`Room #${roomId} has expired or does not exist. Create a new room to start chatting.`);
          window.history.replaceState(null, '', '/');
          setRoomId(null);
          setMessages([]);
          setPeers([]);
        } else {
          setRoomNoticeAlert(null);
          window.history.replaceState(null, '', `/${roomId}`);
        }
      })
      .catch(() => {
        // Allow fallback if server offline
      });
  }, [roomId]);

  // ── Fetch Random Human Handle from Backend if not set ──────────────────────
  useEffect(() => {
    if (!handle) {
      fetch(`${BACKEND_URL}/api/users/random-handle`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.handle) {
            setHandleState(data.handle);
            sessionStorage.setItem('p2p_handle', data.handle);
          }
        })
        .catch(() => {
          const fallback = 'NeonPhoenix';
          setHandleState(fallback);
          sessionStorage.setItem('p2p_handle', fallback);
        });
    }
  }, [handle]);

  const setHandle = (newHandle) => {
    setHandleState(newHandle);
    sessionStorage.setItem('p2p_handle', newHandle);
  };

  // ── Monitor Online/Offline Status ─────────────────────────────────────────
  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // ── Sync Room URL (clean path) ─────────────────────────────────────────────
  useEffect(() => {
    if (roomId) {
      window.history.replaceState({}, '', `/${roomId}`);
    } else {
      window.history.replaceState({}, '', '/');
    }
  }, [roomId]);

  // ── Connect Socket.io ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!handle) return;

    const newSocket = io(BACKEND_URL, {
      autoConnect: false,
      auth: { token: captchaToken, handle },
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
    });

    newSocket.connect();

    newSocket.on('connect', () => {
      setIsConnected(true);
      const currentRoom = roomIdRef.current;
      if (currentRoom) {
        newSocket.emit('room:join', { roomId: currentRoom, handle, color: avatarColor });
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Handle room full limit (strict 2-person lock)
    newSocket.on('room:full', ({ error }) => {
      setRoomNoticeAlert(error || 'This room is full. Maximum 2 participants allowed per room.');
      setRoomId(null);
      setMessages([]);
      setPeers([]);
    });

    // Handle room expired (e.g. 1-minute solo timeout or room destroyed)
    newSocket.on('room:expired', ({ message }) => {
      console.warn('[Room Expired Socket Event]', message);
      setRoomNoticeAlert(message || 'Room expired because no second participant joined within 1 minute.');
      window.history.replaceState(null, '', '/');
      setRoomId(null);
      setMessages([]);
      setPeers([]);
    });

    newSocket.on('room:peers', (peerList) => {
      if (peerList && Array.isArray(peerList)) {
        const seen = new Set();
        const deduped = peerList.filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
        setPeers(deduped);
      }
    });

    newSocket.on('message:received', (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      playChimeRef.current?.();
    });

    newSocket.on('message:reaction_added', ({ messageId, emoji }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            const count = (msg.reactions?.[emoji] || 0) + 1;
            return { ...msg, reactions: { ...msg.reactions, [emoji]: count } };
          }
          return msg;
        })
      );
    });

    newSocket.on('message:deleted', ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    newSocket.on('room:ttl_changed', ({ ttl }) => {
      setRoomTTLState(ttl);
    });

    newSocket.on('user:typing', ({ handle: typer }) => {
      setTypingUser(typer);
      setTimeout(() => setTypingUser(null), 3000);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [handle, avatarColor]);

  // ── Fetch Message History on Room Join ────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;
    fetch(`${BACKEND_URL}/api/rooms/${roomId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});
  }, [roomId]);

  // ── Backend File Upload ───────────────────────────────────────────────────
  const uploadFileApi = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BACKEND_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setFileErrorAlert(data.error || 'File upload failed validation on server');
      throw new Error(data.error || 'Server validation failed');
    }

    setFileErrorAlert(null);
    return data;
  };

  const ALLOWED_EXTENSIONS = new Set([
    'jpg', 'jpeg', 'png', 'gif', 'webp',
    'mp4', 'webm', 'mov',
    'mp3', 'wav', 'ogg', 'm4a',
    'pdf', 'doc', 'docx', 'txt', 'zip', 'rar', 'csv', 'xlsx'
  ]);

  const validateFile = (file) => {
    if (!file) return false;

    // Strict 10MB file size limit
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileErrorAlert(`File "${file.name}" exceeds maximum allowed size of 10 MB.`);
      return false;
    }

    // Extension check
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
      setFileErrorAlert(`File type (.${ext || 'unknown'}) is restricted. Allowed: images (jpg, png, webp), videos (mp4, webm), audio (mp3, wav), documents (pdf, docx, txt, zip).`);
      return false;
    }

    setFileErrorAlert(null);
    return true;
  };

  // ── Create Room ────────────────────────────────────────────────────────────
  const createNewRoom = async () => {
    setRoomNoticeAlert(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/rooms/create`, { method: 'POST' });
      const data = await res.json();
      if (data?.roomId) {
        joinRoom(data.roomId, true);
        setActiveModal('qrCode');
        return;
      }
    } catch (e) {}

    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const rand = (n) => Array.from({ length: n }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    const fallbackId = `${rand(3)}-${rand(4)}-${rand(3)}`;
    joinRoom(fallbackId, true);
    setActiveModal('qrCode');
  };

  // ── Join Room (Async Existence & Availability Check) ──────────────────────
  const joinRoom = async (targetRoomId, skipExistCheck = false) => {
    setRoomNoticeAlert(null);
    let cleanCode = (targetRoomId || '').trim().toLowerCase();
    if (cleanCode.includes('/')) cleanCode = cleanCode.split('/').pop();
    if (cleanCode.includes('?')) cleanCode = cleanCode.split('?')[0];

    if (!cleanCode) return false;

    // 1. Strict 3-4-3 format check BEFORE network request
    if (!isValidRoomId(cleanCode)) {
      setRoomNoticeAlert(`Room code "#${cleanCode}" is invalid. Room codes must be 3 letters, 4 letters, and 3 letters separated by hyphens (e.g. tsy-cusn-bti).`);
      return false;
    }

    // 2. Verify room existence in Redis before allowing user to enter
    if (!skipExistCheck) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/rooms/${cleanCode}/exists`);
        const data = await res.json();

        if (!data?.exists) {
          setRoomNoticeAlert(`Room #${cleanCode} does not exist or has expired. Create a new room to start chatting.`);
          return false;
        }
      } catch (e) {
        // Fallback if network issue
      }
    }

    setRoomId(cleanCode);
    setMessages([]);
    setPeers([]);
    window.history.replaceState(null, '', `/${cleanCode}`);

    const sock = socketRef.current;
    if (sock && sock.connected) {
      sock.emit('room:join', { roomId: cleanCode, handle, color: avatarColor });
    }
    return true;
  };

  // ── Leave Room ────────────────────────────────────────────────────────────
  const leaveRoom = () => {
    const sock = socketRef.current;
    if (sock && sock.connected && roomId) {
      sock.emit('room:leave', { roomId });
    }
    setRoomId(null);
    setMessages([]);
    setPeers([]);
    setRoomNoticeAlert(null);
  };

  // ── Set Room TTL ──────────────────────────────────────────────────────────
  const setRoomTTL = (ttl) => {
    setRoomTTLState(ttl);
    const sock = socketRef.current;
    if (sock && sock.connected && roomId) {
      sock.emit('room:set_ttl', { roomId, ttl });
    }
  };

  // ── Emit Typing Indicator ────────────────────────────────────────────────
  const emitTyping = () => {
    const sock = socketRef.current;
    if (!sock || !sock.connected || !roomId) return;
    sock.emit('user:typing', { roomId });
  };

  // ── Copy Invite Link (Clean URL Path e.g. http://localhost:5173/tsy-cusn-bti) ──
  const copyInviteLink = () => {
    const link = `${window.location.origin}/${roomId || ''}`;
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // ── Sound Chime ───────────────────────────────────────────────────────────
  const playChimeRef = useRef(null);
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  };
  useEffect(() => { playChimeRef.current = playChime; }, [soundEnabled]);

  // ── Send Message ──────────────────────────────────────────────────────────
  const sendMessage = (content, fileData = null, replyTo = null) => {
    if (!content.trim() && !fileData) return;

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      roomId,
      sender: { handle, color: avatarColor },
      content: fileData ? '' : content,
      file: fileData,
      replyTo: replyTo
        ? {
            id: replyTo.id,
            handle: replyTo.sender?.handle,
            text: replyTo.content || replyTo.file?.name || 'Attachment',
          }
        : null,
      timestamp: new Date().toISOString(),
      reactions: {},
      ttl: roomTTL,
    };

    setMessages((prev) => [...prev, newMsg]);
    playChime();

    const sock = socketRef.current;
    if (sock && sock.connected && roomId) {
      sock.emit('message:send', { roomId, message: newMsg });
    }
  };

  // ── Add Reaction ──────────────────────────────────────────────────────────
  const addReaction = (messageId, emoji) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const count = (msg.reactions?.[emoji] || 0) + 1;
          return { ...msg, reactions: { ...msg.reactions, [emoji]: count } };
        }
        return msg;
      })
    );
    const sock = socketRef.current;
    if (sock && sock.connected && roomId) {
      sock.emit('message:react', { roomId, messageId, emoji });
    }
  };

  // ── Delete Message ────────────────────────────────────────────────────────
  const deleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    const sock = socketRef.current;
    if (sock && sock.connected && roomId) {
      sock.emit('message:delete', { roomId, messageId });
    }
  };

  // ── Theme Toggle ──────────────────────────────────────────────────────────
  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    localStorage.setItem('famn_theme', next);
  };

  return (
    <ChatContext.Provider
      value={{
        BACKEND_URL,
        handle: handle || 'NeonPhoenix',
        setHandle,
        avatarColor,
        setAvatarColor,
        roomId,
        setRoomId,
        createNewRoom,
        joinRoom,
        leaveRoom,
        roomTTL,
        setRoomTTL,
        hideSecurityBanner,
        setHideSecurityBanner,
        isOffline,
        isConnected,
        validateFile,
        uploadFileApi,
        fileErrorAlert,
        setFileErrorAlert,
        roomNoticeAlert,
        setRoomNoticeAlert,
        messages,
        sendMessage,
        addReaction,
        deleteMessage,
        emitTyping,
        peers,
        typingUser,
        isCaptchaVerified,
        setIsCaptchaVerified,
        copyInviteLink,
        copySuccess,
        mode,
        toggleTheme,
        soundEnabled,
        setSoundEnabled,
        activeModal,
        setActiveModal,
        selectedImage,
        setSelectedImage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
