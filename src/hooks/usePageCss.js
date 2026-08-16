import { useLayoutEffect, useState } from 'react'

const MAP = {
  '/': '/styles.css',
  '/work': '/work.css',
  '/about': '/about.css',
  '/contact': '/contact.css',
}

export function usePageCss(pathname) {
  const [cssReady, setCssReady] = useState(false)

  useLayoutEffect(() => {
    const href = MAP[pathname]

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
      document.querySelectorAll('link[data-page-css]').forEach((l) => {
        if (l !== link) l.remove()
      })
      setCssReady(true)
      document.documentElement.classList.add('css-ready')
    }

    link.addEventListener('load', finish)
    link.addEventListener('error', finish)
    document.head.appendChild(link)

    if (link.sheet) finish()

    const fallback = setTimeout(finish, 1500)

    return () => {
      clearTimeout(fallback)
      link.removeEventListener('load', finish)
      link.removeEventListener('error', finish)
    }
  }, [pathname])

  return cssReady
}
