import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, Lenis } from '../lib/animations';
import Cursor from '../components/Cursor';
import Sidebar from '../components/Sidebar';
import { useSidebarMenu } from '../hooks/useSidebarMenu';
import { useLiveTime } from '../hooks/useLiveTime';

const sidebarItems = [
  { label: 'HOME', href: '/', cls: 'should' },
  { label: 'work', href: '/work', cls: 'should' },
  { label: 'Playground', href: '#', cls: '' },
  {
    label: 'Contact',
    href: 'mailto:muhammadbinriaz675@gmail.com',
    cls: 'notshould',
  },
];

const cardImages = [
  'plug.webp',
  'ixperience.webp',
  'hudu.webp',
  'newP1.jpg',
  'newP2.jpg',
  'newP3.jpg',
  'newP4.jpg',
];

export default function Playground() {
  const wrapRef = useRef(null);
  useSidebarMenu('lower');
  useLiveTime();

  useEffect(() => {
    if (!gsap) return;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // --- Smooth scroll (Lenis) wired into ScrollTrigger -------------------
    // The vertical scroll + the pinned horizontal card scroll both depend on
    // ScrollTrigger being driven by Lenis. Without this link the pin never
    // registers (the page can't scroll) and the cards jump straight to the end.
    let lenis;
    let tickerCb;
    try {
      if (Lenis) {
        lenis = new Lenis();
        lenis.on('scroll', ScrollTrigger.update);
        tickerCb = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tickerCb);
        gsap.ticker.lagSmoothing(0);
      }
    } catch (e) {
      console.error('Lenis failed', e);
    }

    const ctx = gsap.context(() => {
      gsap.from('.nav', { opacity: 0, delay: 1.2, duration: 0.5 });
      gsap.from('img', { opacity: 0, delay: 2, duration: 0.6, stagger: 0.1 });
      gsap.to('.front', {
        y: 0,
        delay: 1.4,
        stagger: 1,
        duration: 1.4,
        ease: 'power3.out',
      });

      // Pinned horizontal scroll (desktop only). Guarded so a failure here
      // can never blank the page. Uses the default (window) scroller which is
      // what Lenis drives.
      try {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px)', () => {
          gsap.to('.card', {
            xPercent: -220,
            ease: 'none',
            scrollTrigger: {
              trigger: '.page2',
              start: 'top top',
              end: '+=6566',
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        });
      } catch (e) {
        console.error('Playground pin failed', e);
      }
    }, wrapRef.current);

    // Re-measure once the layout settles and once images have loaded — image
    // heights affect the pin distance / trigger positions.
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    const imgs = wrapRef.current
      ? Array.from(wrapRef.current.querySelectorAll('img'))
      : [];
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh);
    });

    const cursor = document.querySelector('.cursor');
    const linkHandlers = [];
    document.querySelectorAll('a').forEach((link) => {
      const enter = () => cursor && gsap.to(cursor, { scale: 1.5, duration: 0.3 });
      const leave = () => cursor && gsap.to(cursor, { scale: 1, duration: 0.3 });
      link.addEventListener('mouseenter', enter);
      link.addEventListener('mouseleave', leave);
      linkHandlers.push([link, enter, leave]);
    });

    return () => {
      cancelAnimationFrame(raf);
      imgs.forEach((img) => img.removeEventListener('load', refresh));
      if (tickerCb) gsap.ticker.remove(tickerCb);
      if (lenis) lenis.destroy();
      linkHandlers.forEach(([el, en, lv]) => {
        el.removeEventListener('mouseenter', en);
        el.removeEventListener('mouseleave', lv);
      });
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Cursor variant="follow" />
      <div ref={wrapRef}>
        <Sidebar lowerClass="lower" items={sidebarItems} />

        <div className="page1">
          <div className="nav">
            <div className="left">
              <a href="https://muhammadbinriaz.com">Muhammad Bin Riaz</a>
            </div>
            <div className="middle">
              <h4 className="come">MENU+</h4>
            </div>
            <div className="come2 right">
              <a className="should yes" href="/">
                HOME
              </a>
              <a className="should yes" href="/work">
                WORK
              </a>
              <a className="yes" href="mailto:muhammadbinriaz675@gmail.com">
                CONTACT
              </a>
            </div>
          </div>
          <div className="hero-cont">
            <div className="front">
              <h1>playground</h1>
              <h2>BRAIN DUMP</h2>
            </div>
          </div>
        </div>

        <div className="page2">
          <div className="card-container">
            <div className="card">
              {cardImages.map((src, i) => (
                <img src={'/assets/' + src} alt="" key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
