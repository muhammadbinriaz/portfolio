export const SITE = {
  name: 'Muhammad Bin Riaz',
  role: 'AI & Web Engineer',
  location: 'Islamabad',
  email: 'muhammadbinriaz675@gmail.com',
  // Swap these when you have the canonical profile URLs.
  github: 'https://github.com/MuhammadBinRiaz',
  linkedin: '',
  instagram: 'https://www.instagram.com/malick_158',
  twitter: 'https://x.com/malick_158',
};

export const FOOTER_LINKS = [
  { label: 'GitHub', href: SITE.github },
  { label: 'LinkedIn', href: SITE.linkedin },
  { label: 'Email', href: `mailto:${SITE.email}` },
].filter((l) => l.href);

export const MENU_SOCIALS = [
  { label: 'github', href: SITE.github },
  { label: 'linkedin', href: SITE.linkedin },
  { label: 'instagram', href: SITE.instagram },
  { label: 'x', href: SITE.twitter },
].filter((l) => l.href);
