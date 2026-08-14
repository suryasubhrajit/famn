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
