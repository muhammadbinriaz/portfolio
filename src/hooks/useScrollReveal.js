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

      const mobile = window.matchMedia('(max-width: 768px)').matches;

      ctx = gsap.context(() => {
        gsap.utils.toArray(els).forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: mobile ? 16 : 28 },
            {
              opacity: 1,
              y: 0,
              duration: mobile ? 0.65 : 0.85,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: mobile ? 'top 92%' : 'top 88%',
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
