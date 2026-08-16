import { MENU_SOCIALS, SITE } from '../data/site';

export default function Sidebar({ lowerClass = 'lower', items = [] }) {
  return (
    <div className="full">
      <div className="naver">
        <h4>{SITE.name}</h4>
        <h4 className="cross hover-underline">
          <span>CLOSE</span>
        </h4>
      </div>
      <div className="content">
        <div className="content-div">
          {items.map((it, i) => (
            <h1 key={i}>
              <a className={it.cls} href={it.href}>
                <span className="nav-idx">{it.index}</span>
                {it.label}
              </a>
            </h1>
          ))}
        </div>
      </div>
      <div className="daba">
        <p className="menu-tag">Full-stack · RAG · Agents</p>
        <div className="acc">
          {MENU_SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
            >
              <h3>{s.label}</h3>
            </a>
          ))}
        </div>
        <div className={lowerClass}>
          <h3>&copy; 2026</h3>
          <h3 className="time">12:05 PM</h3>
        </div>
      </div>
    </div>
  );
}
