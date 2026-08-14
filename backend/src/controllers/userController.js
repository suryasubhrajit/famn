import { generateFriendlyHandle } from '../utils/generators.js';

export const getRandomHandle = (req, res) => {
  const handle = generateFriendlyHandle();
  res.json({ handle });
};
