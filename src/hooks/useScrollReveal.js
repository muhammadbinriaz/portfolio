import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/animations';
import { prefersReducedMotion } from '../lib/motion';
import { whenRevealed } from '../lib/transition';

export function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = rootRef && rootRef.current;
    if (!root || !gsap) return;

    let alive = true;
    let ctx;

    whenRevealed().then(() => {
      if (!alive) return;

      const els = root.querySelectorAll('.js-reveal');
      if (!els.length) return;

      if (prefersReducedMotion()) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }

      ctx = gsap.context(() => {
        gsap.utils.toArray(els).forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.95,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            },
          );
        });
      }, root);

      ScrollTrigger.refresh();
    });

    return () => {
      alive = false;
      if (ctx) ctx.revert();
    };
  }, [rootRef]);
}
