import confetti from "canvas-confetti";

// Trigger confetti
const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

export { triggerConfetti };
