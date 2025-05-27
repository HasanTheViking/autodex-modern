import '../styles/globals.css'
import { CartProvider } from '../components/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthProvider } from '../contexts/AuthContext'

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
