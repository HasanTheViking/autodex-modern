// pages/_app.js
import '../styles/globals.css'
import { CartProvider } from '../components/CartContext'
import { AuthProvider } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'

export default function App({ Component, pageProps }) {
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
