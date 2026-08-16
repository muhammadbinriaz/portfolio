import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/animations';
import { prefersReducedMotion } from '../lib/motion';

export function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = rootRef && rootRef.current;
    if (!root || !gsap) return;

    const els = root.querySelectorAll('.js-reveal');
    if (!els.length) return;

    if (prefersReducedMotion()) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.js-reveal').forEach((el) => {
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
    return () => ctx.revert();
  }, [rootRef]);
}
