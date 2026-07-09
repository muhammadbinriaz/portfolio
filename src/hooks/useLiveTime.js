import { useEffect } from 'react'

// Ported from the inline <script> in each original HTML file.
export function useLiveTime() {
  useEffect(() => {
    function updateLiveTime() {
      const now = new Date()
      let hours = now.getHours()
      let minutes = now.getMinutes()
      const amPm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12
      minutes = minutes < 10 ? '0' + minutes : minutes
      const timeString = `${hours}:${minutes} ${amPm}`
      const timeElement = document.querySelector('.footerleft .time')
      if (timeElement) timeElement.textContent = timeString
    }
    updateLiveTime()
    const id = setInterval(updateLiveTime, 1000)
    return () => clearInterval(id)
  }, [])
}
