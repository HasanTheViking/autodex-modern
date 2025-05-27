// pages/_app.js
import '../styles/globals.css'
import { CartProvider } from '../components/CartContext'
import { AuthProvider } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <AuthProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </CartProvider>
  )
}
