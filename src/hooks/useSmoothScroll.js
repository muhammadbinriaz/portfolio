import { useEffect, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, Lenis } from '../lib/animations';
import { registerLenis, resetScroll } from '../lib/scroll';

function attachHideNav(lenis) {
  const nav = document.querySelector('.nav');
  if (!nav || !gsap) return () => {};

  let last = 0;
  let hidden = false;

  const setHidden = (next) => {
    if (document.documentElement.classList.contains('menu-open')) return;
    hidden = next;
    gsap.to(nav, {
      yPercent: next ? -110 : 0,
      duration: 0.5,
      ease: next ? 'power3.inOut' : 'power3.out',
      overwrite: true,
    });
  };

  const onScroll = (y) => {
    if (document.documentElement.classList.contains('menu-open')) return;
    if (y <= 32) {
      if (hidden) setHidden(false);
      last = y;
      return;
    }
    const dy = y - last;
    if (dy > 6 && !hidden) setHidden(true);
    else if (dy < -6 && hidden) setHidden(false);
    last = y;
  };

  const fromLenis = (e) => onScroll(e.scroll);
  const fromWin = () => onScroll(window.scrollY);
  lenis.on('scroll', fromLenis);
  window.addEventListener('scroll', fromWin, { passive: true });

  return () => {
    if (typeof lenis.off === 'function') lenis.off('scroll', fromLenis);
    window.removeEventListener('scroll', fromWin);
    gsap.killTweensOf(nav);
    gsap.set(nav, { yPercent: 0 });
  };
}

export function useSmoothScroll(rootRef) {
  useLayoutEffect(() => {
    resetScroll();
  }, []);

  useEffect(() => {
    if (!Lenis) return;

    const lenis = new Lenis({
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    registerLenis(lenis);
    resetScroll();

    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);

    const detachNav = attachHideNav(lenis);

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
      detachNav();
      gsap.ticker.remove(ticker);
      registerLenis(null);
      lenis.destroy();
    };
  }, [rootRef]);
}
