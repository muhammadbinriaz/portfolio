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
import { projects } from '../data/projects';
import { prefersReducedMotion } from '../lib/motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAfterReveal } from '../hooks/useAfterReveal';

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

  useAfterReveal(() => {
    if (!gsap || !mainRef.current) return;

    const root = mainRef.current;
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(['.work-hero .boundingelem', '.work-lead', '.left', '.middle', '.come2'], {
          clearProps: 'all',
          opacity: 1,
          y: 0,
        });
        root.classList.add('is-entered');
        return;
      }

      gsap.set('.work-hero .boundingelem', { y: '100%', opacity: 0 });
      gsap.set('.work-lead', { opacity: 0, y: 12 });
      gsap.set(['.nav .left', '.nav .middle', '.nav .come2'], { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        onComplete: () => {
          root.classList.add('is-entered');
          gsap.set(['.work-hero .boundingelem', '.work-lead'], {
            clearProps: 'transform,opacity',
          });
          gsap.set(['.nav .left', '.nav .middle', '.nav .come2'], {
            clearProps: 'transform',
            opacity: 1,
          });
        },
      });

      tl.to(['.nav .left', '.nav .middle', '.nav .come2'], {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.04,
      })
        .to(
          '.work-hero .boundingelem',
          { y: 0, opacity: 0.7, duration: 0.8, ease: 'power3.out' },
          '-=0.2',
        )
        .to('.work-lead', { opacity: 0.55, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.35');
    }, root);

    return () => {
      ctx.revert();
      root.classList.remove('is-entered');
    };
  }, []);

  return (
    <>
      <div className="main work-page" ref={mainRef}>
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
            <div className="front work-hero">
              <div className="bounding">
                <h1 className="boundingelem">work</h1>
              </div>
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
