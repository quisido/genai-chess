import { type Color } from 'chess.js';

export const COLORS: Record<Color, string> = {
  b: 'Black',
  w: 'White',
};

export const MODELS: Record<Color, string> = {
  b: 'gemma4',
  w: 'gemma4',
};

export const THINKING: Record<Color, false | 'high' | 'low' | 'medium'> = {
  b: 'low',
  w: false,
};
