import { useEffect, useState } from 'react'

export function useLocation() {
  const [currentLocation, setCurrentLocation] = useState(location)

  useEffect(() => {
    const popStateHandler = (event: PopStateEvent) => {
      setCurrentLocation(location)
    }

    window.addEventListener('popstate', popStateHandler)

    return () => {
      window.removeEventListener('popstate', popStateHandler)
    }
  }, [])

  return currentLocation
}
