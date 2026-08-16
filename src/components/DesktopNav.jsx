import { desktopLinks } from '../data/nav';

export default function DesktopNav({ pathname, className = 'come2' }) {
  return (
    <div className={className}>
      {desktopLinks(pathname).map((item) => (
        <a key={item.href} className="nice should yes" href={item.href}>
          {item.label.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
