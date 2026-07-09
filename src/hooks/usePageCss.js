import { useEffect } from 'react'

const MAP = {
  '/': '/styles.css',
  '/work': '/work.css',
  '/playground': '/playground.css',
}

// Each original page loaded its own page-specific CSS. Since an SPA shares one
// document, we swap the page CSS in/out per route to keep the exact same styling.
export function usePageCss(pathname) {
  useEffect(() => {
    const href = MAP[pathname]
    if (!href) return
    document
      .querySelectorAll('link[data-page-css]')
      .forEach((l) => l.remove())
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.setAttribute('data-page-css', '')
    document.head.appendChild(link)
    return () => link.remove()
  }, [pathname])
}
