import { useLayoutEffect, useState } from 'react';
import { gsap } from '../lib/animations';

export default function TransitionOverlay() {
  const [label, setLabel] = useState('Muhammad Bin Riaz');

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => setLabel(mq.matches ? 'Muhammad' : 'Muhammad Bin Riaz');
    apply();
    mq.addEventListener('change', apply);

    const el = document.querySelector('.transition-panel');
    if (el && gsap) {
      gsap.set(el, { y: window.innerHeight, autoAlpha: 0 });
    }

    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <div className="transition" aria-hidden="true">
      <div className="transition-panel">
        <div className="tn">
          <span className="tn-ghost">{label}</span>
          <span className="tn-mask">
            <span className="tn-fill">{label}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
