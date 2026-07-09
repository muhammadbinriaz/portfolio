import { useEffect, useRef } from 'react';
import { gsap } from '../lib/animations';

// variant="mini"  -> the speed-stretching .minicircle (Home)
// variant="follow"-> the trailing .cursor (Work / Playground)
// Listens on window so it always tracks, regardless of which element is under
// the pointer.
export default function Cursor({ variant = 'follow' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanups = [];

    if (variant === 'mini') {
      let xscale = 1;
      let yscale = 1;
      let xprev = 0;
      let yprev = 0;
      let timeout;
      const onMove = (dets) => {
        clearTimeout(timeout);
        xscale = gsap.utils.clamp(0.6, 1.2, Math.abs(dets.clientX - xprev) / 2);
        yscale = gsap.utils.clamp(0.6, 1.2, Math.abs(dets.clientY - yprev) / 2);
        xprev = dets.clientX;
        yprev = dets.clientY;
        el.style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(${xscale}, ${yscale})`;
        timeout = setTimeout(() => {
          el.style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(1,1)`;
        }, 100);
      };
      window.addEventListener('mousemove', onMove);
      cleanups.push(() => window.removeEventListener('mousemove', onMove));
    } else {
      const onMove = (dets) => {
        gsap.to(el, {
          x: dets.clientX,
          y: dets.clientY,
          duration: 0.35,
          overwrite: 'auto',
        });
      };
      window.addEventListener('mousemove', onMove);
      cleanups.push(() => window.removeEventListener('mousemove', onMove));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [variant]);

  if (variant === 'mini') return <div className="minicircle" ref={ref}></div>;
  return <div className="cursor" ref={ref}></div>;
}
