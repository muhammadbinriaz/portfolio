import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger, LocomotiveScroll } from '../lib/animations';
import Cursor from '../components/Cursor';
import Sidebar from '../components/Sidebar';
import { useSidebarMenu } from '../hooks/useSidebarMenu';
import { useLiveTime } from '../hooks/useLiveTime';

const sidebarItems = [
  { label: 'HOME', href: '#', cls: '' },
  { label: 'work', href: '/work', cls: 'nice should' },
  { label: 'Playground', href: '/playground', cls: 'nice should' },
  {
    label: 'Contact',
    href: 'mailto:muhammadbinriaz675@gmail.com',
    cls: 'nice notshould',
  },
];

export default function Home() {
  const mainRef = useRef(null);
  const location = useLocation();
  useSidebarMenu('lower');
  useLiveTime();

  useEffect(() => {
    if (!gsap) return;
    let locoScroll;

    // Entrance + hover animations only need GSAP — run them first so the page
    // is always visible even if the smooth-scroll setup below fails.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to('.nav', {
        y: 10,
        opacity: 1,
        duration: 1.2,
        delay: -0.5,
        ease: 'expo.inOut',
      })
        .to('.boundingelem', {
          y: 0,
          opacity: 0.7,
          ease: 'expo.inOut',
          duration: 1.75,
          delay: -1.15,
          stagger: 0.1,
        })
        .to('.boundingelemUp', {
          y: 0,
          opacity: 1,
          ease: 'expo.inOut',
          duration: 1,
          delay: -1,
          stagger: 0.1,
        })
        .to('.chhotiheadings', {
          opacity: 1,
          duration: 0.75,
          delay: -0.75,
          ease: 'expo.inOut',
        })
        .to('.herofooter', {
          opacity: 1,
          duration: 1,
          delay: -0.8,
          ease: 'expo.inOut',
        });

      document.querySelectorAll('.elem').forEach(function (elem) {
        let rotate = 0;
        elem.addEventListener('mouseleave', function (dets) {
          gsap.to(elem.querySelector('img'), {
            opacity: 0,
            ease: 'power3',
            duration: 0.5,
          });
        });
        elem.addEventListener('mouseover', function (dets) {
          const diff = dets.clientY - elem.getBoundingClientRect().top;
          const diffrot = dets.clientX - rotate;
          rotate = dets.clientX;
          gsap.to(elem.querySelector('img'), {
            opacity: 1,
            zIndex: 99999,
            borderRadius: '20px',
            display: 'block',
            ease: 'power3',
            top: diff,
            left: dets.clientX,
            rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
          });
        });
        elem.addEventListener('mousemove', function (dets) {
          const diff = dets.clientY - elem.getBoundingClientRect().top;
          const diffrot = dets.clientX - rotate;
          rotate = dets.clientX;
          gsap.to(elem.querySelector('img'), {
            opacity: 1,
            borderRadius: '20px',
            ease: 'power3',
            top: diff,
            left: dets.clientX,
            rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
          });
        });
      });
    }, mainRef.current);

    // Smooth scroll (Locomotive + ScrollTrigger proxy). Wrapped so any failure
    // here can never blank the page.
    try {
      if (LocomotiveScroll && mainRef.current) {
        locoScroll = new LocomotiveScroll({
          el: mainRef.current,
          smooth: true,
        });
        locoScroll.on('scroll', ScrollTrigger.update);
        ScrollTrigger.scrollerProxy(mainRef.current, {
          scrollTop(value) {
            return arguments.length
              ? locoScroll.scrollTo(value, 0, 0)
              : locoScroll.scroll.instance.scroll.y;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
          pinType: mainRef.current.style.transform ? 'transform' : 'fixed',
        });
        ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
        ScrollTrigger.refresh();
      }
    } catch (err) {
      console.error('Locomotive setup failed:', err);
    }

    return () => {
      try {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        if (locoScroll) locoScroll.destroy();
      } catch (e) {
        /* noop */
      }
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Cursor variant="mini" />
      <div className="main" ref={mainRef}>
        <Sidebar lowerClass="lower" items={sidebarItems} />

        <div className="hero">
          <div className="nav">
            <a
              href="/"
              className="home-link ok hover-underline"
              onClick={(e) => {
                if (location.pathname === '/') e.preventDefault();
              }}
            >
              Muhammad Bin Riaz
            </a>
            <h4 className="come hover-underline">MENU+</h4>
            <div className="come2">
              <a className="nice should yes" href="/work">
                WORK
              </a>
              <a className="nice should yes" href="/playground">
                PLAYGROUND
              </a>
              <a
                className="nice yes"
                href="mailto:muhammadbinriaz675@gmail.com"
              >
                CONTACT
              </a>
            </div>
          </div>
          <div className="heading">
            <div className="bounding">
              <h1 className="boundingelem web-h1">Web</h1>
            </div>
            <div className="blocktext">
              <div className="bounding">
                <h1 className="secondh1 boundingelem">Engineer</h1>
              </div>
              <div className="bounding">
                <h5 className="boundingelemUp based">BAsed in islamabad</h5>
              </div>
            </div>
          </div>
          <div className="chhotiheadings">
            <div className="bounding">
              <h5 className="boundingelemUp">
                Available for Full Time & Freelance
              </h5>
            </div>
            <div className="bounding">
              <h5 className="boundingelemUp">work from june 25'</h5>
            </div>
          </div>
          <div className="herofooter">
            <a className="yes" href="#">
              Previously worked at<i className="ri-arrow-right-up-line"></i>
              <br />
              code and theory
            </a>
            <a className="yes" href="#">
              Protopie Ambassador<i className="ri-arrow-right-up-line"></i>
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
          <div className="elem">
            <img src="/assets/htmlBest.png" alt="" />
            <h1>HTML</h1>
            <h5>2022</h5>
          </div>
          <div className="elem">
            <img src="/assets/css-3.png" alt="" />
            <h1>CSS</h1>
            <h5>2022</h5>
          </div>
          <div className="elem">
            <img src="/assets/js.png" alt="" />
            <h1>JavaScript</h1>
            <h5>2022</h5>
          </div>
          <div className="elem elemlast">
            <img src="/assets/rct1.png" alt="" />
            <h1>React</h1>
            <h5>2022</h5>
          </div>
          <div className="elem elemlast">
            <img src="/assets/python.webp" alt="" />
            <h1>Python</h1>
            <h5>2022</h5>
          </div>
          <div className="elem elemlast">
            <img src="/assets/nodejs_logo.png" alt="" />
            <h1>Node.JS</h1>
            <h5>2022</h5>
          </div>
          <div className="elem elemlast">
            <img src="/assets/Nextjs1.jpeg" alt="" />
            <h1>NExt.JS</h1>
            <h5>2022</h5>
          </div>
        </div>

        <div className="about">
          <img src="/assets/best.png" alt="" />
          <div className="textabout">
            <h5>(about me)</h5>
            <p>
              I'm a Full-Stack Developer who builds digital experiences that
              don't just work&mdash;they wow. When I'm not coding slick interfaces or
              crushing bugs, I'm probably in a heated debate about tabs vs.
              spaces (tabs, obviously). My philosophy? Clean code, fast loads,
              and just the right amount of magic. Let's make people say, "I need
              this in my life."
            </p>
            <a className="talk" href="mailto:muhammadbinriaz675@gmail.com">
              let's Talk
            </a>
          </div>
        </div>

        <div className="subscribe">
          <h5>Oops, almost forgot&hellip;</h5>
          <h3>
            You can connect me via Slack as well{' '}
            <i className="ri-arrow-down-line"></i>
          </h3>
        </div>

        <div className="footer">
          <div className="footerleft">
            <h5>2025 &copy;</h5>
            <h5 className="time">0:05 AM</h5>
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
