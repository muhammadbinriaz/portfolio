// Block reveal/cover animations — ported faithfully from codegridTransition.js
// Operates on the global ".block" elements rendered by <TransitionOverlay/>.
import { gsap } from './animations';

export function cover() {
  return new Promise((resolve) => {
    if (!gsap) return resolve();
    gsap.killTweensOf('.block');
    gsap.set('.block', { visibility: 'visible', scaleY: 0 });
    gsap.to('.block', {
      scaleY: 1,
      duration: 1,
      stagger: { each: 0.1, from: 'start', grid: [2, 5], axis: 'x' },
      ease: 'power4.inOut',
      onComplete: resolve,
    });
  });
}

export function reveal() {
  return new Promise((resolve) => {
    if (!gsap) return resolve();
    gsap.killTweensOf('.block');
    gsap.set('.block', { scaleY: 1, visibility: 'visible' });
    gsap.to('.block', {
      scaleY: 0,
      duration: 1,
      stagger: { each: 0.1, from: 'start', grid: 'auto', axis: 'x' },
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.set('.block', { visibility: 'hidden' });
        resolve();
      },
    });
  });
}
