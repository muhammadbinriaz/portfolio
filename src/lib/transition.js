import { gsap } from './animations';
import { prefersReducedMotion } from './motion';
import { pauseLenis, resumeLenis, resetScroll } from './scroll';

const EASE = 'power3.inOut';

let busy = false;
const revealDoneWaiters = [];

export function isTransitioning() {
  return busy;
}

/** Resolves when the route cover has fully left (or now if idle). */
export function whenRevealed() {
  return new Promise((resolve) => {
    if (!busy) {
      resolve();
      return;
    }
    revealDoneWaiters.push(resolve);
  });
}

function flushRevealDone() {
  const pending = revealDoneWaiters.splice(0, revealDoneWaiters.length);
  pending.forEach((fn) => fn());
}

function panel() {
  return document.querySelector('.transition-panel');
}

function shell() {
  return document.querySelector('.transition');
}

function maskEl() {
  return document.querySelector('.tn-mask');
}

function nameBox() {
  return document.querySelector('.tn');
}

function ghostEl() {
  return document.querySelector('.tn-ghost');
}

function hideNav() {
  document.documentElement.classList.add('route-covering');
  const nav = document.querySelector('.nav');
  if (nav && gsap) {
    gsap.killTweensOf(nav);
    gsap.set(nav, { autoAlpha: 0 });
  }
}

function showNav() {
  document.documentElement.classList.remove('route-covering');
  const nav = document.querySelector('.nav');
  if (nav && gsap) {
    gsap.killTweensOf(nav);
    gsap.fromTo(
      nav,
      { autoAlpha: 0, yPercent: 0 },
      { autoAlpha: 1, duration: isMobile() ? 0.22 : 0.35, ease: 'power2.out', overwrite: true },
    );
  }
}

function snapMenuClosed() {
  const menu = document.querySelector('.full');
  if (menu && gsap) gsap.set(menu, { yPercent: -100, autoAlpha: 0 });
  document.documentElement.classList.remove('menu-open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  resumeLenis();
}

function isMobile() {
  return window.matchMedia('(max-width: 768px)').matches;
}

export function cover() {
  return new Promise((resolve) => {
    const el = panel();
    if (!el) return resolve();

    busy = true;
    if (shell()) shell().style.pointerEvents = 'auto';
    pauseLenis();

    const h = window.innerHeight;
    const mask = maskEl();
    const ghost = ghostEl();
    const coverDur = isMobile() ? 1.12 : 0.78;

    if (!gsap || prefersReducedMotion()) {
      gsap.set(el, { y: 0, autoAlpha: 1 });
      if (mask) gsap.set(mask, { height: '100%' });
      if (ghost) gsap.set(ghost, { opacity: 0 });
      hideNav();
      snapMenuClosed();
      resetScroll();
      return resolve();
    }

    gsap.killTweensOf(el);
    if (mask) gsap.killTweensOf(mask);
    if (ghost) gsap.killTweensOf(ghost);
    gsap.set(el, { y: h, autoAlpha: 1, force3D: true });
    if (mask) gsap.set(mask, { height: 0 });
    if (ghost) gsap.set(ghost, { opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        resetScroll();
        resolve();
      },
    });
    tl.to(el, {
      y: 0,
      duration: coverDur,
      ease: EASE,
      onComplete: () => {
        // Nav stays visible while gray rises over it, then hides under
        // the solid cover so it cannot collide on the way out.
        hideNav();
        snapMenuClosed();
      },
    });
    if (mask) {
      tl.to(mask, {
        height: () => nameBox()?.offsetHeight || 0,
        duration: isMobile() ? 0.68 : 0.75,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(mask, { height: '100%' });
          if (ghost) gsap.set(ghost, { opacity: 0 });
        },
      });
    }
  });
}

export function reveal() {
  return new Promise((resolve) => {
    const el = panel();
    const mask = maskEl();
    const ghost = ghostEl();
    const h = window.innerHeight;

    const done = () => {
      if (el) gsap.set(el, { y: h, autoAlpha: 0 });
      if (mask) gsap.set(mask, { height: 0 });
      if (ghost) gsap.set(ghost, { opacity: 1 });
      if (shell()) shell().style.pointerEvents = 'none';
      resetScroll();
      showNav();
      busy = false;
      flushRevealDone();
      resolve();
    };

    if (!busy) return done();
    if (!el || !gsap || prefersReducedMotion()) return done();

    // Ensure nav is gone before the panel lifts, so the black bar never
    // peeks through the trailing edge of the gray cover.
    hideNav();

    gsap.killTweensOf(el);
    if (mask) gsap.killTweensOf(mask);
    if (ghost) gsap.killTweensOf(ghost);

    gsap.fromTo(
      el,
      { y: 0, autoAlpha: 1 },
      {
        y: -(h + 8),
        duration: isMobile() ? 1.0 : 0.85,
        ease: EASE,
        force3D: true,
        onComplete: done,
      },
    );
  });
}
