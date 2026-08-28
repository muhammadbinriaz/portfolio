import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/animations';
import { prefersReducedMotion } from '../lib/motion';
import { whenRevealed } from '../lib/transition';

const ENTER_PAGES = ['about-page', 'work-page', 'contact-page'];

function waitForPageEnter(root) {
  const needsEnter = ENTER_PAGES.some((cls) => root.classList.contains(cls));
  if (!needsEnter || root.classList.contains('is-entered')) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (root.classList.contains('is-entered')) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    if (root.classList.contains('is-entered')) {
      observer.disconnect();
      resolve();
    }
  });
}

export function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = rootRef && rootRef.current;
    if (!root || !gsap) return;

    let alive = true;
    let ctx;

    whenRevealed()
      .then(() => waitForPageEnter(root))
      .then(() => {
        if (!alive) return;

        const els = root.querySelectorAll('.js-reveal');
        if (!els.length) return;

        if (prefersReducedMotion()) {
          gsap.set(els, { opacity: 1, y: 0 });
          return;
        }

        const mobile = window.matchMedia('(max-width: 768px)').matches;
        const fromY = mobile ? 16 : 28;

        gsap.set(els, { opacity: 0, y: fromY });

        ctx = gsap.context(() => {
          gsap.utils.toArray(els).forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: fromY },
              {
                opacity: 1,
                y: 0,
                duration: mobile ? 0.65 : 0.85,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: el,
                  start: mobile ? 'top 94%' : 'top 88%',
                  toggleActions: 'play none none none',
                  once: true,
                },
              },
            );
          });
        }, root);

        requestAnimationFrame(() => ScrollTrigger.refresh());
      });

    return () => {
      alive = false;
      if (ctx) ctx.revert();
    };
  }, [rootRef]);
}
