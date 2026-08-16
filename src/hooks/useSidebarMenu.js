import { useEffect } from 'react';
import { gsap } from '../lib/animations';
import { prefersReducedMotion } from '../lib/motion';
import { pauseLenis, resumeLenis } from '../lib/scroll';

export function useSidebarMenu() {
  useEffect(() => {
    if (!gsap) return;

    const panel = document.querySelector('.full');
    const menu = document.querySelector('.come');
    const cross = document.querySelector('.naver .cross');
    if (!panel || !menu) return;

    const reduce = prefersReducedMotion();

    gsap.set(panel, { yPercent: -100, autoAlpha: 0 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

    if (reduce) {
      tl.to(panel, { yPercent: 0, autoAlpha: 1, duration: 0.01 });
    } else {
      tl.to(panel, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: 'power4.inOut',
      }).from(
        panel.querySelectorAll('.content-div h1'),
        { y: 36, opacity: 0, duration: 0.45, stagger: 0.07 },
        '-=0.35',
      );
    }

    const lock = () => {
      document.documentElement.classList.add('menu-open');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      pauseLenis();
    };
    const unlock = () => {
      document.documentElement.classList.remove('menu-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      resumeLenis();
    };

    const open = () => {
      if (tl.progress() === 1 && !tl.reversed()) return;
      lock();
      tl.timeScale(1).play();
    };
    const close = () => {
      if (tl.progress() === 0) {
        unlock();
        return;
      }
      tl.timeScale(1.15).reverse();
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
