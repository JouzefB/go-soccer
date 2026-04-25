export const SKILL_LEVELS = [
  { label: 'Beginner', value: 'beginner', color: '#69F0AE' },
  { label: 'Casual', value: 'casual', color: '#00B0FF' },
  { label: 'Competitive', value: 'competitive', color: '#FFD600' },
  { label: 'Semi-Pro', value: 'semipro', color: '#FF6D00' },
];

export const MATCH_TYPES = [
  { label: '1v1', value: '1v1', maxPlayers: 2 },
  { label: '3v3', value: '3v3', maxPlayers: 6 },
  { label: '5v5', value: '5v5', maxPlayers: 10 },
];

export const GAME_MODES = [
  { label: '⚽ Casual', value: 'casual' },
  { label: '🏆 Ranked', value: 'ranked' },
  { label: '🎯 Practice', value: 'practice' },
  { label: '🚨 Need Players ASAP', value: 'urgent' },
];

export const RANK_TIERS = [
  { name: 'Bronze', minPoints: 0, color: '#CD7F32' },
  { name: 'Silver', minPoints: 500, color: '#C0C0C0' },
  { name: 'Gold', minPoints: 1000, color: '#FFD600' },
  { name: 'Platinum', minPoints: 2000, color: '#00E5FF' },
  { name: 'Diamond', minPoints: 3500, color: '#AA00FF' },
  { name: 'Legend', minPoints: 5000, color: '#FF6D00' },
];