// pages/api/checkout.js

import Stripe from 'stripe'
import { db } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Inicializujeme Stripe s tajným kľúčom zo .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  // Ak to nie je POST, vrátime 405 (metóda nepovolená)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metóda nie je povolená' })
  }

  try {
    // Rozbalíme JSON telo požiadavky
    const { cartItems, total, address, contact, user } = req.body

    // -----------------------------------------
    // 1) VALIDÁCIA VSTUPNÝCH PARAMETROV
    // -----------------------------------------

    // 1.1) overíme, že košík existuje a je neprázdne pole
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Košík je prázdny alebo nie je vo formáte pole.')
    }

    // 1.2) overíme, že total je číslo väčšie ako 0
    if (typeof total !== 'number' || total <= 0) {
      throw new Error('Neplatná suma za nákup.')
    }

    // 1.3) overíme, že adresa obsahuje street, city a zip (všetko ako reťazce)
    if (
      !address ||
      typeof address.street !== 'string' ||
      typeof address.city !== 'string' ||
      typeof address.zip !== 'string'
    ) {
      throw new Error('Neplatné údaje o adrese (street, city, zip).')
    }

    // 1.4) overíme, že contact obsahuje name, email a phone (všetko ako reťazce)
    if (
      !contact ||
      typeof contact.name !== 'string' ||
      typeof contact.email !== 'string' ||
      typeof contact.phone !== 'string'
    ) {
      throw new Error('Neplatné kontaktné údaje (name, email, phone).')
    }

    // 1.5) overíme, že používateľ (user) existuje a má uid (string)
    if (!user || typeof user.uid !== 'string') {
      throw new Error('Používateľ nie je prihlásený.')
    }

    // -----------------------------------------
    // 2) PRÍPRAVA POLOŽIEK DO Stripe
    // -----------------------------------------
    // Stripe vyžaduje: line_items: [ { price_data: { currency, product_data, unit_amount }, quantity } ]

    const line_items = cartItems.map((item) => {
      // Očakávame, že každá položka v cartItems má:
      //   item.name (string), item.price (number), item.qty (number)
      if (
        !item.name ||
        typeof item.name !== 'string' ||
        typeof item.price !== 'number' ||
        typeof item.qty !== 'number' ||
        item.price < 0 ||
        item.qty <= 0
      ) {
        throw new Error('Neplatné údaje o položke v košíku.')
      }

      return {
        price_data: {
          currency: 'eur', // alebo 'usd', podľa potreby
          product_data: {
            name: item.name,
            // Tu by sa dali pridávať napr. obrázky: 
            // images: [ item.imageUrl ], ak máš URL obrázka
          },
          unit_amount: Math.round(item.price * 100), // suma v centoch
        },
        quantity: item.qty,
      }
    })

    // -----------------------------------------
    // 3) VYTVORENIE Stripe Checkout Session
    // -----------------------------------------
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      // Môžeš poslať zákazníkovu email, aby bol vyplnený v Stripe checkout formulári:
      customer_email: contact.email,
      // Kam klienta presmerovať po úspešnej platbe:
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      // Kam po zrušení:
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: {
        userId: user.uid,
      },
    })

    // -----------------------------------------
    // 4) ULOŽENIE OBJEDNÁVKY DO Firestore
    // -----------------------------------------
    // Vytvoríme si dokument v kolekcii "orders"
    await addDoc(collection(db, 'orders'), {
      userId: user.uid,
      items: cartItems,
      amount: total,
      address,
      contact,
      status: 'pending', // alebo iný počiatočný stav
      createdAt: serverTimestamp(),
      sessionId: session.id, // stripe checkout session id
    })

    // -----------------------------------------
    // 5) VRÁTIME URL, kam má klient presmerovať
    // -----------------------------------------
    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('❌ Checkout error:', err)
    // Vrátime klientovi presnú chybovú hlášku v JSON (status 400)
    return res.status(400).json({ error: err.message })
  }
}
