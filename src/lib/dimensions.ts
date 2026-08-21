// Dimension color mapping using the washi/tatami theme
// These colors are carefully chosen to match the Japanese aesthetic
// while being visually distinct for multi-line charts

export const DIMENSION_COLORS: Record<string, string> = {
  depression: 'hsl(120, 30%, 38%)',     // celadon green
  anxiety: 'hsl(150, 25%, 40%)',        // muted sage
  stress: 'hsl(30, 50%, 55%)',         // washi ochre
  'well-being': 'hsl(160, 40%, 45%)',  // soft celadon
  PTSD: 'hsl(0, 50%, 50%)',            // vermillion red
  ADHD: 'hsl(200, 40%, 55%)',          // soft blue
  sleep: 'hsl(220, 30%, 60%)',         // indigo
  OCD: 'hsl(280, 30%, 55%)',           // purple
  cognitive: 'hsl(30, 30%, 60%)',     // warm tan
  default: 'hsl(150, 30%, 40%)',
};

export const DIMENSION_LABELS: Record<string, string> = {
  depression: 'Depression',
  anxiety: 'Anxiety',
  stress: 'Stress',
  'well-being': 'Well-being',
  PTSD: 'PTSD',
  ADHD: 'ADHD',
  sleep: 'Sleep',
  OCD: 'OCD',
  cognitive: 'Cognitive',
};

export const INVERTED_DIMENSIONS = new Set([
  'depression',
  'anxiety',
  'stress',
  'PTSD',
  'ADHD',
  'sleep',
  'OCD',
]);
