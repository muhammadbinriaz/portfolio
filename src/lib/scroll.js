let lenis = null;

export function registerLenis(instance) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function resetScroll() {
  if (typeof window === 'undefined') return;
  window.scrollTo(0, 0);
  if (lenis) lenis.scrollTo(0, { immediate: true });
}

export function pauseLenis() {
  if (lenis && typeof lenis.stop === 'function') lenis.stop();
}

export function resumeLenis() {
  if (lenis && typeof lenis.start === 'function') lenis.start();
}
