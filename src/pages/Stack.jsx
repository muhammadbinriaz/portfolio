import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/animations';
import Cursor from '../components/Cursor';
import Sidebar from '../components/Sidebar';
import { useSidebarMenu } from '../hooks/useSidebarMenu';
import { useLiveTime } from '../hooks/useLiveTime';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

// skillicons.dev gives consistent, dark-friendly logos for most of these.
// Swap any `/assets/tech/*.svg` placeholders with your own downloads later.
const si = (id) => `https://skillicons.dev/icons?i=${id}`;
const local = (name) => `/assets/tech/${name}.svg`;

const categories = [
  {
    title: 'Languages & Frameworks',
    items: [
      { n: 'Python', i: si('py') },
      { n: 'JavaScript', i: si('js') },
      { n: 'TypeScript', i: si('ts') },
      { n: 'React', i: si('react') },
      { n: 'Next.js', i: si('nextjs') },
      { n: 'Django', i: si('django') },
      { n: 'FastAPI', i: si('fastapi') },
      { n: 'Flask', i: si('flask') },
      { n: 'Node.js', i: si('nodejs') },
      { n: 'HTML5', i: si('html') },
      { n: 'CSS3', i: si('css') },
      { n: 'Tailwind CSS', i: si('tailwind') },
      { n: 'Bootstrap', i: si('bootstrap') },
      { n: 'Pydantic', i: local('pydantic') },
      { n: 'SQLAlchemy', i: local('sqlalchemy') },
    ],
  },
  {
    title: 'AI & Machine Learning',
    items: [
      { n: 'TensorFlow', i: si('tensorflow') },
      { n: 'PyTorch', i: si('pytorch') },
      { n: 'Scikit-learn', i: si('sklearn') },
      { n: 'Hugging Face', i: local('huggingface') },
      { n: 'LangChain', i: local('langchain') },
      { n: 'OpenAI', i: local('openai') },
      { n: 'RAG', i: local('rag') },
      { n: 'Agentic AI', i: local('agentic') },
      { n: 'LlamaIndex', i: local('llamaindex') },
    ],
  },
  {
    title: 'Databases, Graphs & Vector Stores',
    items: [
      { n: 'PostgreSQL', i: si('postgres') },
      { n: 'MySQL', i: si('mysql') },
      { n: 'MongoDB', i: si('mongodb') },
      { n: 'Redis', i: si('redis') },
      { n: 'Neo4j', i: local('neo4j') },
      { n: 'Pinecone', i: local('pinecone') },
      { n: 'Chroma', i: local('chroma') },
      { n: 'Weaviate', i: local('weaviate') },
    ],
  },
  {
    title: 'DevOps & Cloud',
    items: [
      { n: 'Docker', i: si('docker') },
      { n: 'Kubernetes', i: si('kubernetes') },
      { n: 'GCP', i: si('gcp') },
      { n: 'Azure', i: si('azure') },
      { n: 'Linux', i: si('linux') },
      { n: 'GitHub Actions', i: local('githubactions') },
    ],
  },
  {
    title: 'Tools',
    items: [
      { n: 'Git', i: si('git') },
      { n: 'GitHub', i: si('github') },
      { n: 'VS Code', i: si('vscode') },
      { n: 'Jupyter', i: si('jupyter') },
      { n: 'PyCharm', i: si('pycharm') },
    ],
  },
];

const sidebarItems = [
  { label: 'HOME', href: '/', cls: 'should' },
  { label: 'work', href: '/work', cls: 'should' },
  { label: 'Playground', href: '/playground', cls: 'should' },
  { label: 'Stack', href: '#', cls: '' },
  { label: 'Contact', href: 'mailto:muhammadbinriaz675@gmail.com', cls: 'notshould' },
];

export default function Stack() {
  const wrapRef = useRef(null);
  const previewRef = useRef(null);
  useSidebarMenu();
  useLiveTime();
  useSmoothScroll(wrapRef);

  useEffect(() => {
    if (!gsap) return;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const preview = previewRef.current;

    const ctx = gsap.context(() => {
      // Hero reveal — same clip-from-below "bounding" effect as the home
      // "AI & WEB Engineer" heading (expo.out, staggered).
      gsap.set('.stack-hero .boundingelem', { y: '100%', opacity: 0 });
      gsap.set('.stack-hero p', { opacity: 0 });

      const tl = gsap.timeline();
      tl.to('.stack-hero .boundingelem', {
        y: 0,
        opacity: 1,
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.12,
      }).to(
        '.stack-hero p',
        { opacity: 0.5, duration: 0.8, ease: 'power2.out' },
        '-=0.85',
      );

      // Reveal each category (heading + pills) as it scrolls into view.
      // toggleActions reverse => replays every time you scroll down into it
      // and re-hides when you scroll back up (loops on scroll up/down).
      gsap.utils.toArray('.cat').forEach((cat) => {
        gsap.from(cat.querySelectorAll('.cat-title, .tech'), {
          y: 26,
          opacity: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cat,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, wrapRef);

    // Shared floating logo that swaps to whichever pill is hovered — the home
    // page effect, but one image handles all 40+ items (never saturated).
    let rotate = 0;
    gsap.set(preview, { scale: 0.85, opacity: 0 });
    const xTo = gsap.quickTo(preview, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.45, ease: 'power3' });

    const handlers = [];
    gsap.utils.toArray('.tech').forEach((el) => {
      const src = el.getAttribute('data-icon');
      const enter = (e) => {
        if (src) preview.src = src;
        xTo(e.clientX);
        yTo(e.clientY);
        gsap.to(preview, { opacity: 1, scale: 1, duration: 0.3, overwrite: 'auto' });
      };
      const move = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
        const diffrot = e.clientX - rotate;
        rotate = e.clientX;
        gsap.to(preview, {
          rotate: gsap.utils.clamp(-22, 22, diffrot * 0.4),
          duration: 0.6,
          overwrite: 'auto',
        });
      };
      const leave = () =>
        gsap.to(preview, { opacity: 0, scale: 0.85, duration: 0.3, overwrite: 'auto' });
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
      handlers.push([el, enter, move, leave]);
    });

    return () => {
      handlers.forEach(([el, en, mv, lv]) => {
        el.removeEventListener('mouseenter', en);
        el.removeEventListener('mousemove', mv);
        el.removeEventListener('mouseleave', lv);
      });
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Cursor />
      <img className="tech-preview" ref={previewRef} alt="" aria-hidden="true" />
      <div className="stack" ref={wrapRef}>
        <Sidebar lowerClass="lower" items={sidebarItems} />

        <div className="nav">
          <div className="left">
            <a href="/" className="should">Muhammad Bin Riaz</a>
          </div>
          <div className="middle">
            <h4 className="come">MENU+</h4>
          </div>
          <div className="come2 right">
            <a className="should yes" href="/">HOME</a>
            <a className="should yes" href="/work">WORK</a>
            <a className="should yes" href="/playground">PLAYGROUND</a>
            <a className="yes" href="mailto:muhammadbinriaz675@gmail.com">CONTACT</a>
          </div>
        </div>

        <header className="stack-hero">
          <div className="bounding">
            <h1 className="boundingelem">Tools &amp;</h1>
          </div>
          <div className="bounding">
            <h1 className="boundingelem">Technologies</h1>
          </div>
          <p>
            The stack I reach for to design, build, ship and scale products —
            from front-end interfaces to AI systems and the infrastructure that
            runs them. Hover any tech to preview it.
          </p>
        </header>

        <main className="stack-body">
          {categories.map((cat) => (
            <section className="cat" key={cat.title}>
              <div className="cat-title">
                <h2>{cat.title}</h2>
                <span className="count">
                  {String(cat.items.length).padStart(2, '0')}
                </span>
              </div>
              <div className="cat-grid">
                {cat.items.map((it) => (
                  <div className="tech" key={it.n} data-icon={it.i}>
                    <img
                      className="tech-ico"
                      src={it.i}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span>{it.n}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>

        <div className="footer">
          <div className="footerleft">
            <h5>2025 &copy;</h5>
            <h5 className="time">0:05 AM</h5>
          </div>
          <div className="footerright">
            <a className="yes" href="https://webwiz-world.slack.com/team/U095KFWFLTW" target="_blank" rel="noreferrer">slack</a>
            <a className="yes" href="https://www.instagram.com/malick_158?igsh=MXc5cnhheHpnZXoxNQ==" target="_blank" rel="noreferrer">Instagram</a>
            <a className="yes" href="#" target="_blank" rel="noreferrer">LINKEDIN</a>
            <a className="yes" href="https://x.com/malick_158?t=NOFN7hWzudUNqBa5SIcz1w&s=09" target="_blank" rel="noreferrer">twitter/x</a>
          </div>
        </div>
      </div>
    </>
  );
}
