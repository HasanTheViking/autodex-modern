import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-gray-100 p-4 flex flex-col md:flex-row items-center justify-between shadow-lg z-50">
      <p className="mb-2 md:mb-0">
        Používame cookies na zlepšenie vášho zážitku. Pokračovaním súhlasíte s našou 
        <a href="/privacy" className="underline ml-1">zásadou ochrany osobných údajov</a>.
      </p>
      <button
        onClick={accept}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Súhlasím
      </button>
    </div>
  )
}
