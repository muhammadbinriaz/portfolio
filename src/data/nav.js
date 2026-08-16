export const NAV = [
  { id: 'home', label: 'HOME', href: '/' },
  { id: 'work', label: 'WORK', href: '/work' },
  { id: 'about', label: 'ABOUT', href: '/about' },
  { id: 'contact', label: 'CONTACT', href: '/contact' },
];

export function sidebarItems(pathname) {
  return NAV.map((item, i) => {
    const active = item.href === pathname;
    return {
      label: item.label,
      href: active ? '#' : item.href,
      cls: active ? 'is-current' : 'nice should',
      index: String(i + 1).padStart(2, '0'),
    };
  });
}

export function desktopLinks(pathname) {
  return NAV.filter((item) => item.href !== pathname);
}
