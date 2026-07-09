import { useEffect, useRef } from 'react';
import { gsap } from '../lib/animations';

// Ported from the loader logic in script.js (counter + collapsing bars).
// Shown once on first load of the home route (mirrors the original home loader).
export default function Loader({ onDone }) {
  const counterRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!gsap) {
      if (onDone) onDone();
      return;
    }
    document.body.style.overflow = 'hidden';

    let currentValue = 0;
    const counterEl = counterRef.current;

    function updateCounter() {
      if (currentValue === 100) return;
      currentValue += Math.floor(Math.random() * 10) + 1;
      if (currentValue > 100) currentValue = 100;
      if (counterEl) counterEl.textContent = currentValue;
      const delay = Math.floor(Math.random() * 200) + 1;
      setTimeout(updateCounter, delay);
    }
    updateCounter();

    const t1 = gsap.to(counterEl, {
      duration: 0.25,
      delay: 2.5,
      opacity: 0,
    });
    const t2 = gsap.to('.bar', {
      duration: 1.5,
      delay: 2.5,
      height: 0,
      stagger: { amount: 0.5 },
      ease: 'power4.inOut',
      onComplete: () => {
        document.body.style.overflow = '';
        if (onDone) onDone();
      },
    });

    return () => {
      document.body.style.overflow = '';
      t1.kill();
      t2.kill();
    };
  }, [onDone]);

  return (
    <>
      <h1 className="counter" ref={counterRef}></h1>
      <div className="overlay" ref={overlayRef}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </>
  );
}
