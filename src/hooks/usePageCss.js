import { useLayoutEffect, useState } from 'react'

const MAP = {
  '/': '/styles.css',
  '/work': '/work.css',
  '/playground': '/playground.css',
  '/stack': '/stack.css',
}

// Each original page loaded its own page-specific CSS. Since an SPA shares one
// document, we swap the page CSS in/out per route to keep the exact same styling.
//
// Returns `cssReady` — true only once the route's stylesheet has actually been
// applied. Consumers gate rendering/animations on it so we never (a) flash raw
// unstyled HTML, or (b) measure/animate elements before their CSS exists (which
// broke the hero letter reveal and the Playground pinned scroll).
export function usePageCss(pathname) {
  const [cssReady, setCssReady] = useState(false)

  // useLayoutEffect so the swap happens before the browser paints the new route.
  useLayoutEffect(() => {
    const href = MAP[pathname]

    // New route -> nothing is guaranteed styled yet.
    setCssReady(false)
    document.documentElement.classList.remove('css-ready')

    if (!href) {
      setCssReady(true)
      document.documentElement.classList.add('css-ready')
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.setAttribute('data-page-css', '')

    let done = false
    const finish = () => {
      if (done) return
      done = true
      // Remove the *previous* route's stylesheet only after the new one is live,
      // so there is never a frame with zero page CSS.
      document.querySelectorAll('link[data-page-css]').forEach((l) => {
        if (l !== link) l.remove()
      })
      setCssReady(true)
      document.documentElement.classList.add('css-ready')
    }

    link.addEventListener('load', finish)
    link.addEventListener('error', finish)
    document.head.appendChild(link)

    // If it was preloaded/cached the sheet may already be parsed synchronously.
    if (link.sheet) finish()

    // Safety net: never leave the page hidden if load/error somehow never fire.
    const fallback = setTimeout(finish, 1500)

    return () => {
      clearTimeout(fallback)
      link.removeEventListener('load', finish)
      link.removeEventListener('error', finish)
    }
  }, [pathname])

  return cssReady
}
