import { useEffect } from 'react';
import { gsap } from '../lib/animations';

// Fullscreen menu open/close. Snappier + cleaner than the original port:
// one paused timeline, played forward on open and reversed (faster) on close.
export function useSidebarMenu() {
  useEffect(() => {
    if (!gsap) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
    });

    tl.to('.full', { top: '0vw', duration: 0.5, ease: 'power4.inOut' })
      .from(
        '.full h4',
        { y: -60, opacity: 0, duration: 0.35, stagger: 0.05 },
        '-=0.25'
      )
      .from(
        '.content-div h1',
        { y: 60, opacity: 0, duration: 0.4, stagger: 0.06 },
        '-=0.2'
      )
      .from(
        '.daba h3',
        { y: 24, opacity: 0, duration: 0.3, stagger: 0.03 },
        '-=0.25'
      );

    const menu = document.querySelector('.come');
    const cross = document.querySelector('.naver .cross');
    const not = document.querySelector('.notshould');

    const open = () => {
      document.body.style.overflow = 'hidden';
      tl.timeScale(1).play();
    };
    const close = () => {
      // Reverse a bit faster than open (crisp but not abrupt), then re-enable scroll.
      tl.timeScale(1.35).reverse();
      tl.eventCallback('onReverseComplete', () => {
        document.body.style.overflow = '';
      });
    };

    menu && menu.addEventListener('click', open);
    cross && cross.addEventListener('click', close);
    not && not.addEventListener('click', close);

    return () => {
      menu && menu.removeEventListener('click', open);
      cross && cross.removeEventListener('click', close);
      not && not.removeEventListener('click', close);
      document.body.style.overflow = '';
      tl.kill();
    };
  }, []);
}
