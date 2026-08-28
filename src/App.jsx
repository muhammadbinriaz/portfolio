import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useLayoutEffect, useState } from 'react'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Contact from './pages/Contact'
import Loader from './components/Loader'
import TransitionOverlay from './components/TransitionOverlay'
import ErrorBoundary from './components/ErrorBoundary'
import Cursor from './components/Cursor'
import { cover, reveal, isTransitioning } from './lib/transition'
import { resetScroll } from './lib/scroll'
import { usePageCss } from './hooks/usePageCss'
import { prefersReducedMotion } from './lib/motion'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(() => {
    if (location.pathname !== '/') return true
    return prefersReducedMotion()
  })

  const cssReady = usePageCss(location.pathname)

  useLayoutEffect(() => {
    resetScroll()
  }, [location.pathname])

  useEffect(() => {
    function onClick(e) {
      const link = e.target.closest('.should')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return
      if (href === window.location.pathname) return
      if (isTransitioning()) return
      e.preventDefault()
      cover().then(() => {
        resetScroll()
        navigate(href)
      })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  useEffect(() => {
    if (!cssReady || !isTransitioning()) return
    const id = window.setTimeout(() => {
      reveal()
    }, 280)
    return () => window.clearTimeout(id)
  }, [cssReady, location.pathname])

  return (
    <>
      <TransitionOverlay />
      <Cursor />
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <ErrorBoundary>
        {cssReady && (
          <Routes location={location}>
            <Route path="/" element={<Home animate={loaded} />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/playground" element={<Navigate to="/" replace />} />
            <Route path="/stack" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </ErrorBoundary>
    </>
  )
}
