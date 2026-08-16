import { FOOTER_LINKS } from '../data/site';

export default function Footer() {
  return (
    <div className="footer">
      <div className="footerleft">
        <h5>2026 &copy;</h5>
        <h5 className="time">0:05 AM</h5>
      </div>
      <div className="footerright">
        {FOOTER_LINKS.map((l) => (
          <a
            key={l.label}
            className="yes"
            href={l.href}
            target={l.href.startsWith('mailto:') ? undefined : '_blank'}
            rel={l.href.startsWith('mailto:') ? undefined : 'noreferrer'}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
