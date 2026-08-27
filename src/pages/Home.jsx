import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '../lib/animations';
import Sidebar from '../components/Sidebar';
import DesktopNav from '../components/DesktopNav';
import Footer from '../components/Footer';
import { useSidebarMenu } from '../hooks/useSidebarMenu';
import { useLiveTime } from '../hooks/useLiveTime';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { sidebarItems } from '../data/nav';
import { SITE } from '../data/site';
import { prefersReducedMotion } from '../lib/motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAfterReveal } from '../hooks/useAfterReveal';

const services = [
  {
    title: 'Full Stack Web',
    tag: 'Apps & APIs',
    img: '/assets/rct1.png',
  },
  {
    title: 'AI systems (RAG)',
    tag: 'Grounded answers',
    img: '/assets/langchain-color1.png',
  },
  {
    title: 'Agentic AI',
    tag: 'Pipelines & tools',
    img: '/assets/tech/agentic.svg',
  },
];

export default function Home({ animate = true }) {
  const mainRef = useRef(null);
  const location = useLocation();
  useSidebarMenu();
  useLiveTime();
  useSmoothScroll(mainRef);
  useScrollReveal(mainRef);

  useAfterReveal(() => {
    if (!gsap || !animate) return;

    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(
          ['.nav', '.boundingelem', '.boundingelemUp', '.chhotiheadings', '.herofooter'],
          { clearProps: 'all', opacity: 1, y: 0 },
        );
        return;
      }

      gsap.set('.boundingelem', { y: '100%', opacity: 0 });
      gsap.set('.boundingelemUp', { y: '-200%' });
      gsap.set(['.nav', '.chhotiheadings', '.herofooter'], { opacity: 0 });
      gsap.set('.nav .home-link, .nav .come, .come2 a', { y: -12, opacity: 0 });

      const tl = gsap.timeline();
      tl.to('.nav', { opacity: 1, duration: 0.5, ease: 'power2.out' })
        .to(
          '.nav .home-link, .nav .come, .come2 a',
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
          '-=0.25',
        )
        .to(
          '.boundingelem',
          {
            y: 0,
            opacity: 0.7,
            ease: 'expo.out',
            duration: 1.05,
            stagger: 0.08,
          },
          '-=0.2',
        )
        .to(
          '.boundingelemUp',
          {
            y: 0,
            opacity: 1,
            ease: 'expo.out',
            duration: 0.85,
            stagger: 0.06,
          },
          '-=0.75',
        )
        .to(
          '.chhotiheadings',
          { opacity: 1, duration: 0.55, ease: 'power2.out' },
          '-=0.45',
        )
        .to(
          '.herofooter',
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.35',
        );

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.elem').forEach((elem) => {
          const img = elem.querySelector('img');
          if (!img) return;
          gsap.set(img, { xPercent: -50, yPercent: -50, top: 0, left: 0 });
          const xTo = gsap.quickTo(img, 'x', { duration: 0.4, ease: 'power3' });
          const yTo = gsap.quickTo(img, 'y', { duration: 0.4, ease: 'power3' });
          let rotate = 0;

          const setPos = (e) => {
            const rect = elem.getBoundingClientRect();
            xTo(e.clientX - rect.left);
            yTo(e.clientY - rect.top);
            const diffrot = e.clientX - rotate;
            rotate = e.clientX;
            gsap.to(img, {
              rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
              duration: 0.45,
              overwrite: 'auto',
            });
          };

          elem.addEventListener('mouseenter', (e) => {
            gsap.set(img, { zIndex: 99999, display: 'block' });
            gsap.to(img, { opacity: 1, borderRadius: '20px', duration: 0.25, overwrite: 'auto' });
            setPos(e);
          });
          elem.addEventListener('mousemove', setPos);
          elem.addEventListener('mouseleave', () => {
            gsap.to(img, { opacity: 0, ease: 'power3', duration: 0.35 });
          });
        });
      }
    }, mainRef.current);

    return () => ctx.revert();
  }, [animate]);

  return (
    <>
      <div className="main" ref={mainRef}>
        <Sidebar lowerClass="lower" items={sidebarItems(location.pathname)} />

        <div className="hero">
          <div className="nav">
            <a
              href="/"
              className="home-link ok hover-underline"
              onClick={(e) => {
                if (location.pathname === '/') e.preventDefault();
              }}
            >
              {SITE.name}
            </a>
            <h4 className="come hover-underline">MENU+</h4>
            <DesktopNav pathname={location.pathname} />
          </div>
          <div className="heading">
            <div className="bounding">
              <h1 className="boundingelem web-h1">AI &amp; WEB</h1>
            </div>
            <div className="blocktext">
              <div className="bounding">
                <h1 className="secondh1 boundingelem">Engineer</h1>
              </div>
              <div className="bounding">
                <h5 className="boundingelemUp based">Based in Islamabad</h5>
              </div>
            </div>
          </div>
          <div className="chhotiheadings">
            <div className="bounding">
              <h5 className="boundingelemUp">
                Available for freelance
              </h5>
            </div>
            <div className="bounding">
              <h5 className="boundingelemUp">BS CS · 5th semester</h5>
            </div>
          </div>
          <div className="herofooter">
            <a className="yes should" href="/work">
              Selected work
              <i className="ri-arrow-right-up-line"></i>
            </a>
            <a
              className="yes"
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <i className="ri-arrow-right-up-line"></i>
            </a>
            <div className="iconset">
              <div className="circle">
                <i className="ri-arrow-down-line"></i>
              </div>
              <div className="circle">
                <i className="ri-arrow-down-line"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="second">
          {services.map((s, i) => (
            <div
              className={
                i === services.length - 1
                  ? 'elem elemlast js-reveal'
                  : 'elem js-reveal'
              }
              key={s.title}
            >
              <img src={s.img} alt="" />
              <h1>{s.title}</h1>
              <h5>{s.tag}</h5>
            </div>
          ))}
        </div>

        <div className="about js-reveal">
          <img src="/assets/best.png" alt={SITE.name} />
          <div className="textabout">
            <h5>(about me)</h5>
            <p>
              I&apos;m a full-stack developer in Islamabad building web products
              and AI systems — RAG, agents, and the APIs behind them. Fifth
              semester CS, taking on freelance work.
            </p>
            <a className="talk should" href="/about">
              more about me
            </a>
          </div>
        </div>

        <div className="subscribe js-reveal">
          <h5>Selected work</h5>
          <h3>
            <a className="should yes" href="/work">
              See projects
              <i className="ri-arrow-right-up-line"></i>
            </a>
          </h3>
        </div>

        <Footer />
      </div>
    </>
  );
}
