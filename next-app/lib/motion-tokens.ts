export const sukiMotion = {
  duration: {
    fast: 0.16,
    standard: 0.28,
    emphasized: 0.52,
  },
  ease: {
    out: [0.16, 1, 0.3, 1] as const,
    inOut: [0.77, 0, 0.175, 1] as const,
    emphasized: [0.2, 0, 0, 1] as const,
  },
  spring: {
    press: { type: 'spring' as const, stiffness: 500, damping: 30, mass: 0.6 },
    panel: { type: 'spring' as const, stiffness: 420, damping: 40, mass: 0.5 },
    gentle: { type: 'spring' as const, stiffness: 180, damping: 24, mass: 1 },
    float: { type: 'spring' as const, stiffness: 120, damping: 14, mass: 0.8 },
  },
} as const;
