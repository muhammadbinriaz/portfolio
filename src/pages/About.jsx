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
import { getLenis } from '../lib/scroll';

const groups = [
  {
    title: 'Web',
    items: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
  },
  {
    title: 'AI',
    items: ['Python', 'FastAPI', 'RAG', 'LangChain', 'Agents'],
  },
];

const steps = [
  {
    n: '01',
    title: 'Brief',
    body: 'We agree on the outcome, the stack, and what “done” looks like before a line of code.',
  },
  {
    n: '02',
    title: 'Build',
    body: 'I ship in slices you can click — UI, API, and data together — not a big reveal at the end.',
  },
  {
    n: '03',
    title: 'Handoff',
    body: 'Clean repo, notes on how to run it, and a pass to make sure you can keep moving without me.',
  },
];

export default function About() {
  const wrapRef = useRef(null);
  const location = useLocation();
  useSidebarMenu();
  useLiveTime();
  useSmoothScroll(wrapRef);
  useScrollReveal(wrapRef);

  useAfterReveal(() => {
    if (!gsap || !wrapRef.current) return;

    const root = wrapRef.current;
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(['.about-hero .boundingelem', '.about-hero p', '.about-hero .hero-aside'], {
          clearProps: 'transform,opacity',
        });
        root.classList.add('is-entered');
        return;
      }

      gsap.set('.about-hero .boundingelem', { y: '100%', opacity: 0 });
      gsap.set('.about-hero p', { opacity: 0 });
      gsap.set('.about-hero .hero-aside', { opacity: 0, y: 16 });

      const tl = gsap.timeline({
        onComplete: () => {
          root.classList.add('is-entered');
          gsap.set(['.about-hero .boundingelem', '.about-hero p', '.about-hero .hero-aside'], {
            clearProps: 'transform,opacity',
          });
        },
      });
      tl.to('.about-hero .boundingelem', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
      })
        .to('.about-hero p', { opacity: 0.55, duration: 0.55, ease: 'power2.out' }, '-=0.45')
        .to('.about-hero .hero-aside', { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.5');
    }, root);

    return () => {
      ctx.revert();
      root.classList.remove('is-entered');
    };
  }, []);

  function onIndexClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="about-page" ref={wrapRef}>
      <Sidebar lowerClass="lower" items={sidebarItems(location.pathname)} />

      <div className="nav">
        <div className="left">
          <a href="/" className="should">
            {SITE.name}
          </a>
        </div>
        <div className="middle">
          <h4 className="come">MENU+</h4>
        </div>
        <DesktopNav pathname={location.pathname} className="come2 right" />
      </div>

      <header className="about-hero">
        <div className="hero-main">
          <div className="bounding">
            <h1 className="boundingelem">About</h1>
          </div>
          <p>
            Full-stack web and AI — based in {SITE.location}, available for freelance.
          </p>
        </div>
        <aside className="hero-aside">
          <p className="aside-kicker">(index)</p>
          <ol className="hero-index">
            <li>
              <a className="yes" href="#education" onClick={onIndexClick}>
                <span className="idx">01</span>Education
              </a>
            </li>
            <li>
              <a className="yes" href="#process" onClick={onIndexClick}>
                <span className="idx">02</span>How I work
              </a>
            </li>
            <li>
              <a className="yes" href="#scope" onClick={onIndexClick}>
                <span className="idx">03</span>What I take
              </a>
            </li>
            <li>
              <a className="yes" href="#stack" onClick={onIndexClick}>
                <span className="idx">04</span>Stack
              </a>
            </li>
          </ol>
        </aside>
      </header>

      <section className="about-intro js-reveal">
        <div className="about-copy">
          <h5>(who I am)</h5>
          <p>
            I&apos;m {SITE.name}, a fifth-semester Computer Science student. I
            build web products end to end, and AI features that actually ship —
            retrieval-augmented systems, tool-using agents, and the APIs they
            sit on.
          </p>
          <p>
            I&apos;m starting freelance work on Upwork and LinkedIn. If you need
            a full-stack app, a RAG layer, or an automation pipeline, that&apos;s
            the work I take.
          </p>
        </div>
      </section>

      <section className="band js-reveal" id="education">
        <div className="band-head">
          <h5>(education)</h5>
          <h2>BS Computer Science · 5th semester</h2>
        </div>
        <p className="band-copy">
          Coursework in data structures, databases, and software engineering —
          applied on real repos, not only assignments. I treat client work the
          same way I treat a lab: scoped, documented, and demoable.
        </p>
      </section>

      <section className="band js-reveal" id="process">
        <div className="band-head">
          <h5>(how I work)</h5>
          <h2>Short loops. Clear handoff.</h2>
        </div>
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.n}>
              <span className="step-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="band js-reveal" id="scope">
        <div className="band-head">
          <h5>(what I take)</h5>
          <h2>Web products and AI systems.</h2>
        </div>
        <div className="take-grid">
          <article>
            <h3>Full-stack apps</h3>
            <p>
              Interfaces, APIs, and a database that agree with each other.
              Auth, dashboards, CRUD that doesn&apos;t feel like a template.
            </p>
          </article>
          <article>
            <h3>RAG &amp; agents</h3>
            <p>
              Answers grounded in your files. Agents that call tools and run
              pipelines — leads, research, internal ops — instead of a naked chatbot.
            </p>
          </article>
          <article>
            <h3>Not a fit</h3>
            <p>
              Pure visual design with no build, native mobile, or a 43-service
              “AI transformation.” I stay in the work I can stand behind.
            </p>
          </article>
        </div>
      </section>

      <main className="about-body" id="stack">
        {groups.map((g) => (
          <section className="cat js-reveal" key={g.title}>
            <div className="cat-title">
              <h2>{g.title}</h2>
              <span className="count">{String(g.items.length).padStart(2, '0')}</span>
            </div>
            <div className="cat-grid">
              {g.items.map((n) => (
                <div className="tech" key={n}>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <section className="about-me js-reveal">
        <img src="/assets/best.png" alt={SITE.name} />
        <div className="textabout">
          <h5>(about me)</h5>
          <p>
            If you need a full-stack product, a RAG layer, or an agent in a
            real workflow — that&apos;s the work I take. Islamabad-based, usually
            easy overlap with EU afternoons and US mornings. Send a short brief.
          </p>
          <a className="talk should" href="/contact">
            let&apos;s talk
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
