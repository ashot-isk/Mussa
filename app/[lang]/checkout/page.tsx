"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ui, Lang } from "../../i18n/config";
import { useCart } from "../../providers/CartProvider";

export default function CheckoutPage({ params }: { params: { lang: Lang } }) {
  const t = ui[params.lang];
  const { items, total, clear, lang } = useCart();

  const handlePay = () => {
    alert("Here you integrate real payment API. This is a demo checkout.");
    clear();
  };

  const title =
    lang === "ru" ? "Оформление заказа" : lang === "hy" ? "Պատվերի ձևակերպում" : "Checkout";

  return (
    <>
      <Header t={t} />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl mb-6">{title}</h1>
        {items.length === 0 ? (
          <p className="text-sm text-dark/70">
            {lang === "ru" ? "Корзина пуста." : lang === "hy" ? "Զամբյուղը դատարկ է։" : "Your cart is empty."}
          </p>
        ) : (
          <>
            <div className="space-y-3 mb-6 text-sm">
              {items.map(item => (
                <div key={item.id} className="flex justify-between border-b border-black/5 pb-1">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>{(item.price * item.qty).toLocaleString("ru-RU")} ֏</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold text-sm mb-6">
              <span>Total</span>
              <span>{total.toLocaleString("ru-RU")} ֏</span>
            </div>
            <button
              onClick={handlePay}
              className="px-6 py-3 bg-accent text-white rounded-full text-xs uppercase tracking-[0.12em]"
            >
              {lang === "ru" ? "Оплатить (демо)" : lang === "hy" ? "Վճարել (դեմո)" : "Pay (demo)"}
            </button>
          </>
        )}
      </main>
      <Footer t={t} />
    </>
  );
}
