"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ui, Lang } from "../../i18n/config";
import { useCart } from "../../providers/CartProvider";

export default function CheckoutPage({ params }: { params: { lang: Lang } }) {
  const t = ui[params.lang];
  const { items, total, clear, lang } = useCart();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Yerevan");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setError("Cart is empty");
      return;
    }

    setSubmitting(true);
    setError("");

    const orderData = {
      customer: {
        fullName,
        email,
        phone,
        address,
        city,
      },
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.qty,
      })),
      deliveryAddress: `${address}, ${city}`,
      deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString() : null,
      deliveryTime,
      notes,
      paymentMethod,
    };

    try {
      const response = await fetch("http://localhost:5074/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        clear();
        alert(
          `Order placed successfully! Order ID: ${order.id}\n\nWe'll contact you at ${email} to confirm delivery.`
        );
        router.push(`/${params.lang}`);
      } else {
        const errorData = await response.text();
        setError(errorData || "Failed to place order");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    lang === "ru"
      ? "Оформление заказа"
      : lang === "hy"
      ? "Պատվերի ձևակերպում"
      : "Checkout";

  return (
    <>
      <Header t={t} />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl mb-6">{title}</h1>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark/70 mb-4">
              {lang === "ru"
                ? "Корзина пуста."
                : lang === "hy"
                ? "Զամբյուղը դատարկ է։"
                : "Your cart is empty."}
            </p>
            <a
              href={`/${params.lang}/shop`}
              className="px-6 py-3 bg-accent text-white rounded-full text-xs uppercase tracking-[0.12em] inline-block"
            >
              {lang === "ru"
                ? "В магазин"
                : lang === "hy"
                ? "Խանութ"
                : "Go to Shop"}
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {/* Order Summary */}
            <div>
              <h2 className="font-serif text-xl mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b border-black/5 pb-2"
                  >
                    <span className="text-sm">
                      {item.name} × {item.qty}
                    </span>
                    <span className="text-sm font-medium">
                      {(item.price * item.qty).toLocaleString("ru-RU")} ֏
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-black/10 pt-4">
                <span>Total</span>
                <span>{total.toLocaleString("ru-RU")} ֏</span>
              </div>
            </div>

            {/* Checkout Form */}
            <div>
              <h2 className="font-serif text-xl mb-4">Delivery Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="+374 99 123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Street, Building, Apt"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Slot
                    </label>
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                      <option value="">Any time</option>
                      <option value="9:00 AM - 12:00 PM">
                        9:00 AM - 12:00 PM
                      </option>
                      <option value="12:00 PM - 3:00 PM">
                        12:00 PM - 3:00 PM
                      </option>
                      <option value="3:00 PM - 6:00 PM">
                        3:00 PM - 6:00 PM
                      </option>
                      <option value="6:00 PM - 9:00 PM">
                        6:00 PM - 9:00 PM
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="Cash">Cash on Delivery</option>
                    <option value="Card">Card on Delivery</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Any special requests or message for the recipient..."
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-accent text-white rounded-full text-xs uppercase tracking-[0.12em] font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Placing Order..."
                    : lang === "ru"
                    ? "Оформить заказ"
                    : lang === "hy"
                    ? "Ձևակերպել պատվերը"
                    : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer t={t} />
    </>
  );
}
