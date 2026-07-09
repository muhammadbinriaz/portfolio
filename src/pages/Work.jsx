import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, Lenis } from '../lib/animations';
import Cursor from '../components/Cursor';
import Sidebar from '../components/Sidebar';
import { useSidebarMenu } from '../hooks/useSidebarMenu';
import { useLiveTime } from '../hooks/useLiveTime';

const sidebarItems = [
  { label: 'HOME', href: '/', cls: 'should' },
  { label: 'work', href: '#', cls: '' },
  { label: 'Playground', href: '/playground', cls: 'should' },
  {
    label: 'Contact',
    href: 'mailto:muhammadbinriaz675@gmail.com',
    cls: 'notshould',
  },
];

const gridItems = [
  { img: 'ixperience.webp', title: 'LUCId Dreams', year: '2023' },
  { img: 'hudu.webp', title: 'hudu', year: '2023' },
  { img: 'newP1.jpg', title: 'fashion draw', year: '2024' },
  { img: 'newP2.jpg', title: 'Portfolio design', year: '2024' },
  { img: 'newP3.jpg', title: 'beverage product', year: '2024' },
  { img: 'newP4.jpg', title: 'store ux', year: '2025' },
  { img: 'newP5.jpg', title: 'earphones ux', year: '2025' },
  { img: 'newP6.jpg', title: 'App home', year: '2025' },
];

export default function Work() {
  const mainRef = useRef(null);
  useSidebarMenu('lower1');
  useLiveTime();

  useEffect(() => {
    if (!gsap) return;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.items', { opacity: 0, duration: 0.6, delay: 2 });
      gsap.to(['.front h1', '.front button'], {
        y: 0,
        delay: 0.85,
        duration: 1.4,
        ease: 'power3.out',
      });
      gsap.to(['.left', '.middle', '.come2'], {
        y: 0,
        delay: 1,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power3.out',
        opacity: 1,
      });
    }, mainRef.current);

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
    const imgHandlers = [];
    document.querySelectorAll('.image').forEach((image) => {
      const enter = () => {
        if (!cursor) return;
        cursor.innerHTML = 'View More';
        cursor.style.fontSize = '.3vw';
        gsap.to(cursor, {
          scale: 5,
          backgroundColor: '#ffffff8a',
          color: '#fff',
          height: 32,
          width: 32,
        });
      };
      const leave = () => {
        if (!cursor) return;
        cursor.innerHTML = '';
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: '#fff',
          height: 12,
          width: 12,
        });
      };
      image.addEventListener('mouseover', enter);
      image.addEventListener('mouseleave', leave);
      imgHandlers.push([image, enter, leave]);
    });

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
      imgHandlers.forEach(([el, en, lv]) => {
        el.removeEventListener('mouseover', en);
        el.removeEventListener('mouseleave', lv);
      });
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
      <div className="main" ref={mainRef}>
        <Sidebar lowerClass="lower1" items={sidebarItems} />

        <div className="hero">
          <div className="nav">
            <div className="left">
              <a href="https://muhammadbinriaz.com">Muhammad Bin Riaz</a>
            </div>
            <div className="middle">
              <h4 className="come">MENU</h4>
            </div>
            <div className="come2 right">
              <a className="should yes" href="/">
                HOME
              </a>
              <a className="should yes" href="/playground">
                PLAYGROUND
              </a>
              <a className="yes" href="mailto:muhammadbinriaz675@gmail.com">
                CONTACT
              </a>
            </div>
          </div>
          <div className="hero-cont">
            <div className="front">
              <h1 className="giver">work</h1>
              <button>ixperience</button>
            </div>
            <div className="lower">
              {gridItems.map((it, i) => (
                <div className="grid-img-container" key={i}>
                  <div className="items">
                    <div className="overlay"></div>
                    <img src={'/assets/' + it.img} className="image" alt="" />
                    <div className="bottom-line">
                      <h2>{it.title}</h2>
                      <h1>{it.year}</h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="about">
          <img src="/assets/best.png" alt="" />
          <div className="textabout">
            <h5>(about me)</h5>
            <p>
              Need a sleek, simple website or a sophisticated, complex web
              application with high-end, advanced animation? I deliver both with
              precision and creative flair. Let's connect to bring your unique
              vision to life.
            </p>
            <a
              className="yes"
              href="mailto:muhammadbinriaz675@gmail.com"
            >
              let's Talk
            </a>
          </div>
        </div>

        <div className="footer">
          <div className="footerleft">
            <h5>2025 &copy;</h5>
            <h5 className="time">0:05 AM EST</h5>
          </div>
          <div className="footerright">
            <a
              className="yes"
              href="https://webwiz-world.slack.com/team/U095KFWFLTW"
              target="_blank"
            >
              slack
            </a>
            <a
              className="yes"
              href="https://www.instagram.com/malick_158?igsh=MXc5cnhheHpnZXoxNQ=="
              target="_blank"
            >
              Instagram
            </a>
            <a className="yes" href="#" target="_blank">
              LINKEDIN
            </a>
            <a
              className="yes"
              href="https://x.com/malick_158?t=NOFN7hWzudUNqBa5SIcz1w&s=09"
              target="_blank"
            >
              twitter/x
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
