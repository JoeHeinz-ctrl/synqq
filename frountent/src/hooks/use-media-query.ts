import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    // older browsers use addListener
    if (mql.addEventListener) mql.addEventListener("change", handler)
    else mql.addListener(handler)
    setMatches(mql.matches)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler)
      else mql.removeListener(handler)
    }
  }, [query])

  return matches
}
