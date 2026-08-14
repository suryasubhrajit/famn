const ADJECTIVES = [
  'Cyber', 'Neon', 'Cosmic', 'Solar', 'Velvet', 'Quantum', 'Pixel', 'Astro',
  'Sonic', 'Lunar', 'Starlight', 'Hyper', 'Zenith', 'Echo', 'Vivid', 'Shadow',
  'Turbo', 'Mystic', 'Blaze', 'Drift', 'Alpha', 'Omega', 'Nova', 'Vortex'
];

const NOUNS = [
  'Panda', 'Falcon', 'Otter', 'Fox', 'Koala', 'Tiger', 'Wolf', 'Lynx',
  'Bear', 'Hawk', 'Dolphin', 'Panther', 'Phoenix', 'Raven', 'Eagle', 'Cheetah',
  'Viper', 'Jaguar', 'Bison', 'Cobra', 'Orion', 'Pulsar', 'Titan', 'Spectre'
];

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

// Google Meet Style Room Code Generator (3-4-3 letters e.g. "tsy-cusn-bti")
export const generateUniqueRoomId = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const part1 = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  const part3 = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  return `${part1}-${part2}-${part3}`;
};

// Backend server-side human-readable handle generator
export const generateFriendlyHandle = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}${noun}`;
};
