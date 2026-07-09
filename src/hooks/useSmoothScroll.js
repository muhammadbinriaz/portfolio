import { useEffect } from 'react';
import { gsap, ScrollTrigger, Lenis } from '../lib/animations';

// One smooth-scroll implementation for the whole app (Lenis), replacing the
// heavier LocomotiveScroll that used to throttle the home page and show its own
// scrollbar. Driving Lenis from gsap's ticker keeps everything on a single rAF
// loop (smoother, 60fps friendly) and keeps ScrollTrigger perfectly in sync.
//
// rootRef: the page wrapper, used to watch its images/size so the scroll limit
// is recomputed once media loads (this is what was locking mobile scrolling
// until the menu was toggled).
export function useSmoothScroll(rootRef) {
  useEffect(() => {
    if (!Lenis) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native (non-hijacked) touch scrolling — reliable on mobile.
      syncTouch: false,
    });

    // Always start a freshly-mounted route at the top (SPA keeps the old scroll
    // position otherwise, which made revisits feel "weird").
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Recompute scroll extents once the layout/images settle.
    const resize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(resize);
    window.addEventListener('load', resize);

    const root = rootRef && rootRef.current;
    const imgs = root ? Array.from(root.querySelectorAll('img')) : [];
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', resize);
    });

    const ro =
      root && 'ResizeObserver' in window
        ? new ResizeObserver(() => lenis.resize())
        : null;
    if (ro && root) ro.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', resize);
      imgs.forEach((img) => img.removeEventListener('load', resize));
      if (ro) ro.disconnect();
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [rootRef]);
}
