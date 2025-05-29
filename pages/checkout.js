// napr. vo funkcii handleSubmit v pages/checkout.js
const handleSubmit = async e => {
  e.preventDefault();
  try {
    // posielame objednávku na server
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ /* všetky polia z formulára + items */ })
    });
    const data = await res.json();
    console.log("💡 checkout response:", data);

    if (!res.ok) {
      // server vrátil error status
      throw new Error(data.error || "Neznáma chyba z API");
    }

    // v prípade Stripe
    if (data.sessionId) {
      const stripe = await getStripe(); // tvoje volanie na init Stripe
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) throw error;
    } else if (data.orderCreated) {
      // napr. pri platbe dobierkou ťa presmerujem na stránku s potvrdením
      window.location.href = "/order-confirmation";
    }

  } catch (err) {
    console.error("❌ Checkout error:", err);
    alert("Chyba pri platbe: " + err.message);
  }
};