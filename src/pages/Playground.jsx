import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/animations';
import Cursor from '../components/Cursor';
import Sidebar from '../components/Sidebar';
import { useSidebarMenu } from '../hooks/useSidebarMenu';
import { useLiveTime } from '../hooks/useLiveTime';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

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
  useSidebarMenu();
  useLiveTime();
  useSmoothScroll(wrapRef); // shared Lenis (drives ScrollTrigger + fixes mobile scroll)

  useEffect(() => {
    if (!gsap) return;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.nav', { opacity: 0, delay: 1.2, duration: 0.5 });
      gsap.from('.card img', {
        opacity: 0,
        delay: 2,
        duration: 0.6,
        stagger: 0.1,
      });
      gsap.to('.front', {
        y: 0,
        delay: 1.4,
        stagger: 1,
        duration: 1.4,
        ease: 'power3.out',
      });

      // Pinned horizontal scroll (desktop only). Guarded so a failure here
      // can never blank the page. Uses the default (window) scroller driven by
      // the shared Lenis instance.
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

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Cursor />
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
                <img
                  src={'/assets/' + src}
                  alt=""
                  key={i}
                  decoding="async"
                  loading={i < 3 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
