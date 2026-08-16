import { gsap } from './animations';
import { prefersReducedMotion } from './motion';
import { resumeLenis } from './scroll';

const EASE = 'power3.inOut';

let busy = false;

export function isTransitioning() {
  return busy;
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

function showNav() {
  document.documentElement.classList.remove('route-covering');
  const nav = document.querySelector('.nav');
  if (nav && gsap) gsap.set(nav, { autoAlpha: 1, yPercent: 0 });
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

    const h = window.innerHeight;
    const mask = maskEl();
    const coverDur = isMobile() ? 1.4 : 0.9;

    if (!gsap || prefersReducedMotion()) {
      gsap.set(el, { y: 0, autoAlpha: 1 });
      if (mask) gsap.set(mask, { height: '100%' });
      snapMenuClosed();
      return resolve();
    }

    gsap.killTweensOf(el);
    if (mask) gsap.killTweensOf(mask);
    gsap.set(el, { y: h, autoAlpha: 1, force3D: true });
    if (mask) gsap.set(mask, { height: 0 });

    const tl = gsap.timeline({ onComplete: resolve });
    tl.to(el, {
      y: 0,
      duration: coverDur,
      ease: EASE,
      onComplete: snapMenuClosed,
    });
    if (mask) {
      tl.to(mask, {
        height: () => nameBox()?.offsetHeight || 0,
        duration: 0.85,
        ease: 'power2.inOut',
      });
    }
  });
}

export function reveal() {
  return new Promise((resolve) => {
    const el = panel();
    const mask = maskEl();
    const h = window.innerHeight;

    const done = () => {
      if (el) gsap.set(el, { y: h, autoAlpha: 0 });
      if (mask) gsap.set(mask, { height: 0 });
      if (shell()) shell().style.pointerEvents = 'none';
      showNav();
      busy = false;
      resolve();
    };

    if (!busy) return done();
    if (!el || !gsap || prefersReducedMotion()) return done();

    gsap.killTweensOf(el);
    if (mask) gsap.killTweensOf(mask);
    gsap.fromTo(
      el,
      { y: 0, autoAlpha: 1 },
      {
        y: -h,
        duration: 0.8,
        ease: EASE,
        force3D: true,
        onComplete: done,
      },
    );
  });
}
