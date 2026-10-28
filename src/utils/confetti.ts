import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  // Check if reduced motion is preferred
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Multi-burst colorful child-friendly star and round confetti
  const end = Date.now() + 1000;
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export function fireStarBurst() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  confetti({
    particleCount: 40,
    spread: 70,
    origin: { y: 0.6 },
    shapes: ['star', 'circle'],
    colors: ['#FBBF24', '#F59E0B', '#EF4444', '#10B981', '#6366F1'],
  });
}
