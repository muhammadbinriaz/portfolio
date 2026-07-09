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
      // can never blank the page.
      try {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px)', () => {
          gsap.to('.card', {
            xPercent: '-220',
            ease: 'none',
            scrollTrigger: {
              trigger: '.page2',
              scroller: 'body',
              start: 'top top',
              end: '+=6566',
              scrub: 1,
              pin: true,
            },
          });
        });
      } catch (e) {
        console.error('Playground pin failed', e);
      }
    }, wrapRef.current);

    let lenis;
    let rafId;
    try {
      if (Lenis) {
        lenis = new Lenis();
        function raf(time) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
      }
    } catch (e) {
      console.error('Lenis failed', e);
    }

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
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
      linkHandlers.forEach(([el, en, lv]) => {
        el.removeEventListener('mouseenter', en);
        el.removeEventListener('mouseleave', lv);
      });
      ctx.revert();
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
