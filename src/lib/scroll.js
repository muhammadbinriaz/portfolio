let lenis = null;

export function registerLenis(instance) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function pauseLenis() {
  if (lenis && typeof lenis.stop === 'function') lenis.stop();
}

export function resumeLenis() {
  if (lenis && typeof lenis.start === 'function') lenis.start();
}
