import { useEffect } from 'react';
import { gsap } from '../lib/animations';
import { prefersReducedMotion } from '../lib/motion';

export function useFeaturedHover(rootRef) {
  useEffect(() => {
    const root = rootRef?.current;
    if (!root || !gsap) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (prefersReducedMotion()) return;

    const rows = root.querySelectorAll('.elem');
    const cursor = document.querySelector('.minicircle');
    const cleanups = [];

    rows.forEach((row) => {
      const img = row.querySelector('img');
      const title = row.querySelector('h1');
      const meta = row.querySelector('.elem-meta');
      if (!img || !title) return;

      gsap.set(img, { xPercent: -50, yPercent: -50, opacity: 0, rotate: 0 });
      const xTo = gsap.quickTo(img, 'x', { duration: 0.45, ease: 'power3' });
      const yTo = gsap.quickTo(img, 'y', { duration: 0.45, ease: 'power3' });

      const onEnter = () => {
        gsap.to(img, { opacity: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(title, { x: '4vw', opacity: 0.45, duration: 0.55, ease: 'power2.out' });
        if (meta) gsap.to(meta, { opacity: 0.45, duration: 0.45, ease: 'power2.out' });
        if (cursor) cursor.classList.add('is-view');
      };

      const onMove = (e) => {
        const rect = row.getBoundingClientRect();
        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);
        gsap.to(img, {
          rotate: gsap.utils.clamp(-12, 12, e.movementX * 0.4),
          duration: 0.35,
          overwrite: 'auto',
        });
      };

      const onLeave = () => {
        gsap.to(img, { opacity: 0, rotate: 0, duration: 0.35, ease: 'power2.out' });
        gsap.to(title, { x: 0, opacity: 1, duration: 0.55, ease: 'power2.out' });
        if (meta) gsap.to(meta, { opacity: 1, duration: 0.45, ease: 'power2.out' });
        if (cursor) cursor.classList.remove('is-view');
      };

      row.addEventListener('mouseenter', onEnter);
      row.addEventListener('mousemove', onMove);
      row.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        row.removeEventListener('mouseenter', onEnter);
        row.removeEventListener('mousemove', onMove);
        row.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      cursor?.classList.remove('is-view');
    };
  }, [rootRef]);
}
