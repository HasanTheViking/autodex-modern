// pages/_app.js
import React from 'react'
import '../styles/globals.css'
import { CartProvider } from '../components/CartContext'
import { AuthProvider } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'

export default function App({ Component, pageProps }) {
  React.useEffect(() => {
    // Globálny handler na zachytenie client-side chýb
    window.onerror = (message, source, line, column, error) => {
      alert(
        `Runtime chyba:\n${message}\n` +
        `v súbore: ${source}\n` +
        `riadok: ${line}, stĺpec: ${column}`
      )
      // vráti true, aby sa prehliadač neprepísal vlastnou hláškou
      return true
    }
  }, [])

  return (
    <CartProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <CookieBanner />

          <main className="flex-grow bg-gray-50 p-6">
            <Component {...pageProps} />
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </CartProvider>
  )
}