import { useLayoutEffect } from 'react';
import { gsap } from '../lib/animations';
import { SITE } from '../data/site';

export default function TransitionOverlay() {
  useLayoutEffect(() => {
    const el = document.querySelector('.transition-panel');
    if (el && gsap) {
      gsap.set(el, { y: window.innerHeight, autoAlpha: 0 });
    }
  }, []);

  const label = SITE.name;

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
