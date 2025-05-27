// pages/_app.js
import '../styles/globals.css'
import { CartProvider } from '../components/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthProvider } from '../contexts/AuthContext'   // <-- importuj AuthProvider

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <AuthProvider>                                     // <-- obal komponenty AuthProviderom
        <Header />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </CartProvider>
  )
}
