import { useEffect } from 'react'
import { gsap } from '../lib/animations'

// Ported from the menu timelines in script.js / transition.js / playground.js.
// lowerClass is "lower" for Home & Playground, "lower1" for Work (their CSS differs).
export function useSidebarMenu(lowerClass = 'lower') {
  useEffect(() => {
    if (!gsap) return

    const tl = gsap.timeline()
    tl.to('.full', { top: '0vw', duration: 0.4 })
    tl.from('.full h4', { y: -150, duration: 0.2, stagger: 0.1, opacity: 0 })
    tl.from('.content-div h1', { x: -150, duration: 0.2, stagger: 0.1, opacity: 0 })
    tl.from('.daba .acc h3', { x: -150, duration: 0.2, stagger: 0.1, opacity: 0 })
    tl.from(`.daba .${lowerClass} h3`, {
      x: -150,
      duration: 0.2,
      stagger: 0.1,
      opacity: 0,
      delay: 0,
    })
    tl.from('.full .come', { opacity: 0 })
    tl.pause()

    const menu = document.querySelector('.come')
    const cross = document.querySelector('.naver .cross')
    const not = document.querySelector('.notshould')

    const onMenu = () => {
      document.body.style.overflow = 'hidden'
      tl.play()
    }
    const onCross = () => {
      document.body.style.overflow = ''
      tl.reverse(1.9)
    }
    const onNot = () => tl.reverse(0.45)

    menu && menu.addEventListener('click', onMenu)
    cross && cross.addEventListener('click', onCross)
    not && not.addEventListener('click', onNot)

    return () => {
      menu && menu.removeEventListener('click', onMenu)
      cross && cross.removeEventListener('click', onCross)
      not && not.removeEventListener('click', onNot)
      tl.kill()
    }
  }, [lowerClass])
}
