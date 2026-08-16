import { useEffect, useRef } from 'react';
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
import { projects } from '../data/projects';
import { prefersReducedMotion } from '../lib/motion';
import { useScrollReveal } from '../hooks/useScrollReveal';

function youtubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return m ? m[1] : null;
}

function ProjectMedia({ project }) {
  const yt = youtubeId(project.video);
  if (yt) {
    return (
      <div className="project-media">
        <iframe
          src={`https://www.youtube.com/embed/${yt}`}
          title={`${project.title} demo`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (project.video) {
    return (
      <div className="project-media">
        <video
          src={project.video}
          poster={project.poster || undefined}
          controls
          playsInline
          preload="metadata"
        />
      </div>
    );
  }
  return (
    <div className="project-media">
      {project.poster ? (
        <img src={project.poster} alt="" className="image" />
      ) : null}
      <div className="demo-ph" aria-label={`${project.title} demo coming`}>
        <i className="ri-play-fill" aria-hidden="true"></i>
        <span>Demo coming</span>
      </div>
    </div>
  );
}

export default function Work() {
  const mainRef = useRef(null);
  const location = useLocation();
  useSidebarMenu();
  useLiveTime();
  useSmoothScroll(mainRef);
  useScrollReveal(mainRef);

  useEffect(() => {
    if (!gsap) return;

    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(['.front h1', '.left', '.middle', '.come2'], {
          clearProps: 'all',
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.to('.front h1', {
        y: 0,
        delay: 0.12,
        duration: 0.9,
        ease: 'expo.out',
      });
      gsap.to(['.left', '.middle', '.come2'], {
        y: 0,
        delay: 0.18,
        duration: 0.75,
        ease: 'power3.out',
        opacity: 1,
      });
    }, mainRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="main" ref={mainRef}>
        <Sidebar lowerClass="lower1" items={sidebarItems(location.pathname)} />

        <div className="hero">
          <div className="nav">
            <div className="left">
              <a className="should" href="/">
                {SITE.name}
              </a>
            </div>
            <div className="middle">
              <h4 className="come">MENU</h4>
            </div>
            <DesktopNav pathname={location.pathname} className="come2 right" />
          </div>
          <div className="hero-cont">
            <div className="front">
              <h1 className="giver">work</h1>
              <p className="work-lead">
                Selected builds — GitHub now, demo videos as they land.
              </p>
            </div>
            <div className="lower">
              {projects.map((project) => (
                <article className="items project js-reveal" key={project.id}>
                  <ProjectMedia project={project} />
                  <div className="bottom-line">
                    <h2>{project.title}</h2>
                    <h1>{project.year}</h1>
                  </div>
                  <p className="project-blurb">{project.blurb}</p>
                  <ul className="project-tags">
                    {project.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <div className="project-links">
                    {project.github ? (
                      <a
                        className="yes"
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                        <i className="ri-arrow-right-up-line"></i>
                      </a>
                    ) : (
                      <span className="muted">GitHub soon</span>
                    )}
                    {project.video ? (
                      <a
                        className="yes"
                        href={project.video}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch demo
                        <i className="ri-arrow-right-up-line"></i>
                      </a>
                    ) : (
                      <span className="muted">Demo coming</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="work-cta js-reveal">
          <a className="talk should yes" href="/contact">
            let&apos;s talk
          </a>
        </div>

        <Footer />
      </div>
    </>
  );
}
