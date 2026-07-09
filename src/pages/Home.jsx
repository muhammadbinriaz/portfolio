import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "../lib/animations";
import Cursor from "../components/Cursor";
import Sidebar from "../components/Sidebar";
import { useSidebarMenu } from "../hooks/useSidebarMenu";
import { useLiveTime } from "../hooks/useLiveTime";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

const sidebarItems = [
  { label: "HOME", href: "#", cls: "" },
  { label: "work", href: "/work", cls: "nice should" },
  { label: "Playground", href: "/playground", cls: "nice should" },
  { label: "Stack", href: "/stack", cls: "nice should" },
  {
    label: "Contact",
    href: "mailto:muhammadbinriaz675@gmail.com",
    cls: "nice notshould",
  },
];

export default function Home({ animate = true }) {
  const mainRef = useRef(null);
  const location = useLocation();
  useSidebarMenu();
  useLiveTime();
  useSmoothScroll(mainRef);

  useEffect(() => {
    // Wait until the loader is done (first load) so the hero reveal is actually
    // visible instead of playing behind the loader overlay.
    if (!gsap || !animate) return;

    const ctx = gsap.context(() => {
      // Pin the from-states explicitly (matches styles.css) so the reveal always
      // animates regardless of stylesheet timing.
      gsap.set(".boundingelem", { y: "100%", opacity: 0 });
      gsap.set(".boundingelemUp", { y: "-200%" });
      gsap.set([".nav", ".chhotiheadings", ".herofooter"], { opacity: 0 });
      gsap.set(".nav .home-link, .nav .come, .come2 a", { y: -20, opacity: 0 });

      const tl = gsap.timeline();
      tl.to(".nav", {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      })
        .to(
          ".nav .home-link, .nav .come, .come2 a",
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .to(
          ".boundingelem",
          {
            y: 0,
            opacity: 0.7,
            ease: "expo.out",
            duration: 1.6,
            stagger: 0.1,
          },
          "-=0.5",
        )
        .to(
          ".boundingelemUp",
          {
            y: 0,
            opacity: 1,
            ease: "expo.out",
            duration: 1,
            stagger: 0.1,
          },
          "-=1.35",
        )
        .to(
          ".chhotiheadings",
          { opacity: 1, duration: 0.75, ease: "power2.out" },
          "-=0.9",
        )
        .to(
          ".herofooter",
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.7",
        );

      // Skill-card image follower. Read the element's top per move — it changes
      // as the page scrolls (Lenis) while hovering, so a cached value would make
      // the image drift up/down. A single getBoundingClientRect read on a
      // (browser-throttled) mousemove is cheap.
      document.querySelectorAll(".elem").forEach((elem) => {
        const img = elem.querySelector("img");
        let rotate = 0;
        const setPos = (e) => {
          const diff = e.clientY - elem.getBoundingClientRect().top;
          const diffrot = e.clientX - rotate;
          rotate = e.clientX;
          gsap.to(img, {
            opacity: 1,
            borderRadius: "20px",
            ease: "power3",
            top: diff,
            left: e.clientX,
            rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
            overwrite: "auto",
          });
        };
        elem.addEventListener("mouseenter", (e) => {
          gsap.set(img, { zIndex: 99999, display: "block" });
          setPos(e);
        });
        elem.addEventListener("mousemove", setPos);
        elem.addEventListener("mouseleave", () => {
          gsap.to(img, { opacity: 0, ease: "power3", duration: 0.5 });
        });
      });
    }, mainRef.current);

    return () => ctx.revert();
  }, [animate]);

  return (
    <>
      <Cursor />
      <div className="main" ref={mainRef}>
        <Sidebar lowerClass="lower" items={sidebarItems} />

        <div className="hero">
          <div className="nav">
            <a
              href="/"
              className="home-link ok hover-underline"
              onClick={(e) => {
                if (location.pathname === "/") e.preventDefault();
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
              <a className="nice should yes" href="/stack">
                STACK
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
              <h1 className="boundingelem web-h1">AI &amp; WEB</h1>
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
              <h5 className="boundingelemUp">work from july 26'</h5>
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
            <h1>AI DEV.</h1>
            <h5>2022</h5>
          </div>
          <div className="elem">
            <img src="/assets/css-3.png" alt="" />
            <h1>PYTHON Dev.</h1>
            <h5>2022</h5>
          </div>
          <div className="elem">
            <img src="/assets/fastapi.png" alt="" />
            <h1>FASTAPI Backend</h1>
            <h5>2022</h5>
          </div>
          <div className="elem elemlast">
            <img src="/assets/rct1.png" alt="" />
            <h1>AGENTIC AI</h1>
            <h5>2022</h5>
          </div>
          <div className="elem elemlast">
            <img src="/assets/python.webp" alt="" />
            <h1>Full STack Dev.</h1>
            <h5>2022</h5>
          </div>
          <div className="elem elemlast">
            <img src="/assets/nodejs_logo.png" alt="" />
            <h1>Node.JS Backend</h1>
            <h5>2022</h5>
          </div>
          <div className="elem elemlast">
            <img src="/assets/Nextjs1.jpeg" alt="" />
            <h1>NExt.JS DEV.</h1>
            <h5>2022</h5>
          </div>

          <div className="elem elemlast">
            <img src="/assets/langchain-color1.png" alt="" />
            <h1>Agentic AI</h1>
            <h5>2022</h5>
          </div>
        </div>

        <div className="about">
          <img src="/assets/best.png" alt="" />
          <div className="textabout">
            <h5>(about me)</h5>
            <p>
              I'm a Full-Stack Developer who builds digital experiences that
              don't just work&mdash;they wow. When I'm not coding slick
              interfaces or crushing bugs, I'm probably in a heated debate about
              tabs vs. spaces (tabs, obviously). My philosophy? Clean code, fast
              loads, and just the right amount of magic. Let's make people say,
              "I need this in my life."
            </p>
            <a className="talk" href="mailto:muhammadbinriaz675@gmail.com">
              let's Talk
            </a>
          </div>
        </div>

        <div className="subscribe">
          <h5>Oops, almost forgot&hellip;</h5>
          <h3>
            You can connect me via Slack as well{" "}
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
