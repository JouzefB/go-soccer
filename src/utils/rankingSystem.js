import { RANK_TIERS } from './constants';

export const calculateELO = (playerRating, opponentRating, won) => {
  const K = 32;
  const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const score = won ? 1 : 0;
  return Math.round(playerRating + K * (score - expected));
};

export const getRankTier = (points) => {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (points >= RANK_TIERS[i].minPoints) return RANK_TIERS[i];
  }
  return RANK_TIERS[0];
};

export const getPointsToNextRank = (points) => {
  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (points < RANK_TIERS[i].minPoints) {
      return RANK_TIERS[i].minPoints - points;
    }
  }
  return 0;
};