import { useEffect, useRef } from 'react';
import { whenRevealed } from '../lib/transition';

/**
 * Runs page-enter work once after the route cover has fully left
 * (or immediately if there is no active transition).
 */
export function useAfterReveal(run, deps = []) {
  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    let alive = true;
    let cleanup;
    let played = false;

    whenRevealed().then(() => {
      if (!alive || played) return;
      played = true;
      cleanup = runRef.current();
    });

    return () => {
      alive = false;
      if (typeof cleanup === 'function') cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
