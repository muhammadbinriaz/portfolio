import { useEffect } from 'react';
import { gsap } from '../lib/animations';
import { prefersReducedMotion } from '../lib/motion';
import { getLenis, pauseLenis, resumeLenis } from '../lib/scroll';

export function useSidebarMenu() {
  useEffect(() => {
    if (!gsap) return;

    const panel = document.querySelector('.full');
    const menu = document.querySelector('.come');
    const cross = document.querySelector('.naver .cross');
    if (!panel || !menu) return;

    const reduce = prefersReducedMotion();
    let scrollY = 0;

    gsap.set(panel, { yPercent: -100, visibility: 'hidden', opacity: 1 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

    if (reduce) {
      tl.to(panel, { yPercent: 0, visibility: 'visible', duration: 0.01 });
    } else {
      tl.to(panel, {
        yPercent: 0,
        visibility: 'visible',
        duration: 0.8,
        ease: 'power4.inOut',
      }).from(
        panel.querySelectorAll('.content-div h1'),
        { y: 24, duration: 0.48, stagger: 0.06 },
        '-=0.38',
      );
    }

    const lock = () => {
      scrollY = window.scrollY || 0;
      document.documentElement.classList.add('menu-open');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      pauseLenis();
    };
    const unlock = () => {
      document.documentElement.classList.remove('menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(scrollY, { immediate: true });
      else window.scrollTo(0, scrollY);
      resumeLenis();
    };

    const open = (e) => {
      e.preventDefault();
      if (tl.progress() === 1 && !tl.reversed()) return;
      lock();
      tl.timeScale(1).play();
    };
    const close = (e) => {
      e.preventDefault();
      if (tl.progress() === 0) {
        unlock();
        return;
      }
      tl.timeScale(1.05).reverse();
    };

    tl.eventCallback('onReverseComplete', unlock);

    menu.addEventListener('click', open);
    cross && cross.addEventListener('click', close);

    return () => {
      menu.removeEventListener('click', open);
      cross && cross.removeEventListener('click', close);
      unlock();
      tl.kill();
    };
  }, []);
}
