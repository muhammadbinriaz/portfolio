import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '../lib/animations';
import Sidebar from '../components/Sidebar';
import DesktopNav from '../components/DesktopNav';
import Footer from '../components/Footer';
import { useSidebarMenu } from '../hooks/useSidebarMenu';
import { useLiveTime } from '../hooks/useLiveTime';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { sidebarItems } from '../data/nav';
import { SITE, FOOTER_LINKS } from '../data/site';
import { prefersReducedMotion } from '../lib/motion';
import { useScrollReveal } from '../hooks/useScrollReveal';

const offers = [
  {
    title: 'Full-stack web',
    body: 'A product you can log into — React or Next, a Node or Python API, Postgres. Built to be handed off, not just demoed.',
  },
  {
    title: 'RAG systems',
    body: 'Chat that answers from your documents. Retrieval, embeddings, citations. Useful inside a real workflow, not a toy.',
  },
  {
    title: 'Agents & pipelines',
    body: 'Lead routing, research loops, internal tools that call APIs and write back. Automation with a human still in control.',
  },
];

const brief = [
  'What you are building, in one paragraph.',
  'Whether this is a new product or a layer on something that exists.',
  'Timeline if you have one — even a rough one.',
  'Links: Figma, repo, docs, examples of what “good” looks like.',
];

export default function Contact() {
  const wrapRef = useRef(null);
  const location = useLocation();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  useSidebarMenu();
  useLiveTime();
  useSmoothScroll(wrapRef);
  useScrollReveal(wrapRef);

  useEffect(() => {
    if (!gsap) return;

    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(['.contact-hero .boundingelem', '.contact-hero p', '.contact-hero .hero-aside'], {
          clearProps: 'all',
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.set('.contact-hero .boundingelem', { y: '100%', opacity: 0 });
      gsap.set('.contact-hero p', { opacity: 0 });
      gsap.set('.contact-hero .hero-aside', { opacity: 0, y: 16 });

      const tl = gsap.timeline();
      tl.to('.contact-hero .boundingelem', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
      })
        .to('.contact-hero p', { opacity: 0.55, duration: 0.55, ease: 'power2.out' }, '-=0.45')
        .to('.contact-hero .hero-aside', { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.5');
    }, wrapRef.current);

    return () => ctx.revert();
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Project inquiry from ${name.trim() || 'portfolio'}`,
    );
    const body = encodeURIComponent(message.trim());
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="contact-page" ref={wrapRef}>
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

      <header className="contact-hero">
        <div className="hero-main">
          <div className="bounding">
            <h1 className="boundingelem">Let&apos;s</h1>
          </div>
          <div className="bounding">
            <h1 className="boundingelem">talk</h1>
          </div>
          <p>
            Freelance from {SITE.location} — full-stack web, RAG, and agents.
            I usually reply within a day.
          </p>
        </div>
        <aside className="hero-aside">
          <dl>
            <div>
              <dt>(now)</dt>
              <dd>Open for freelance</dd>
            </div>
            <div>
              <dt>(reply)</dt>
              <dd>Usually within a day</dd>
            </div>
            <div>
              <dt>(zone)</dt>
              <dd>{SITE.location} · PKT (UTC+5)</dd>
            </div>
            <div>
              <dt>(best for)</dt>
              <dd>Scoped builds with a clear owner</dd>
            </div>
          </dl>
        </aside>
      </header>

      <div className="contact-body">
        <section className="contact-lead js-reveal">
          <h5>(start here)</h5>
          <p>
            Tell me what you are trying to ship. A short note is enough — I
            will come back with questions, a shape for the work, and whether I
            am the right person for it.
          </p>
          <a className="contact-email" href={`mailto:${SITE.email}`}>
            {SITE.email}
            <i className="ri-arrow-right-up-line"></i>
          </a>
          <ul className="contact-socials">
            {FOOTER_LINKS.filter((l) => !l.href.startsWith('mailto:')).map((l) => (
              <li key={l.label}>
                <a className="yes" href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                  <i className="ri-arrow-right-up-line"></i>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="contact-block js-reveal">
          <h5>(what I can help with)</h5>
          <div className="offer-grid">
            {offers.map((o) => (
              <article key={o.title}>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-split js-reveal">
          <div>
            <h5>(a useful brief)</h5>
            <h2>Send this and we can move.</h2>
            <ol className="brief-list">
              {brief.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </div>
          <form className="contact-form" onSubmit={onSubmit}>
            <label>
              Name
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What are you building?"
              />
            </label>
            <button type="submit" className="talk">
              Send email
            </button>
          </form>
        </section>

        <section className="contact-note js-reveal">
          <h5>(availability)</h5>
          <p>
            Open for freelance alongside studies. Best fit: a scoped build with
            a clear owner on your side. Timezone PKT (UTC+5) — overlap with EU
            afternoons and US mornings is usually easy.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
