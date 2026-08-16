import { useEffect, useRef } from 'react';
import { gsap } from '../lib/animations';
import { prefersReducedMotion } from '../lib/motion';

export default function Loader({ onDone }) {
  const wrapRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const finish = () => {
      document.body.style.overflow = '';
      if (onDone) onDone();
    };

    if (!gsap || prefersReducedMotion()) {
      finish();
      return;
    }

    document.body.style.overflow = 'hidden';
    gsap.set(wrapRef.current, { y: 0, force3D: true });

    const mid = 4 + Math.floor(Math.random() * 2);
    const pts = new Set();
    while (pts.size < mid) pts.add(10 + Math.floor(Math.random() * 80));
    const values = [...pts].sort((a, b) => a - b);
    values.push(100);

    let i = 0;
    let timer;
    let exit;

    function tick() {
      const v = values[i];
      if (counterRef.current) counterRef.current.textContent = String(v);
      i += 1;
      if (i >= values.length) {
        exit = gsap.to(wrapRef.current, {
          y: -window.innerHeight,
          duration: 0.85,
          delay: 0.28,
          ease: 'power3.inOut',
          force3D: true,
          onComplete: finish,
        });
        return;
      }
      timer = setTimeout(tick, Math.floor(Math.random() * 200) + 260);
    }

    timer = setTimeout(tick, 320);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
      if (exit) exit.kill();
    };
  }, [onDone]);

  return (
    <div className="loader-screen" ref={wrapRef}>
      <p className="loader-num" ref={counterRef}>
        0
      </p>
    </div>
  );
}
