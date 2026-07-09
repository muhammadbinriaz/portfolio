import { useEffect, useRef } from 'react';
import { gsap } from '../lib/animations';

// One cursor for the whole app: the speed-stretching white dot from the hero.
// Writes transform directly on mousemove (composited, no layout) for 60fps, and
// squishes toward the direction of travel, easing back to a circle when idle.
export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let xprev = 0;
    let yprev = 0;
    let idle;

    const onMove = (e) => {
      clearTimeout(idle);
      const xscale = gsap.utils.clamp(0.6, 1.2, Math.abs(e.clientX - xprev) / 2);
      const yscale = gsap.utils.clamp(0.6, 1.2, Math.abs(e.clientY - yprev) / 2);
      xprev = e.clientX;
      yprev = e.clientY;
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(${xscale}, ${yscale})`;
      idle = setTimeout(() => {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1,1)`;
      }, 100);
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      clearTimeout(idle);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <div className="minicircle" ref={ref}></div>;
}
