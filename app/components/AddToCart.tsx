"use client";

import { useCart } from "../providers/CartProvider";
import { ui, Lang } from "../i18n/config";

type Props = {
  id: string;
  name: string;
  price: number;
  lang: Lang;
};

export default function AddToCart({ id, name, price, lang }: Props) {
  const { addItem } = useCart();
  const t = ui[lang];

  return (
    <button
      onClick={() => addItem({ id, name, price, qty: 1 })}
      className="w-full md:w-auto rounded-full bg-black text-white text-sm uppercase tracking-[0.12em] py-3 px-6 font-medium hover:bg-black/90 transition-colors"
    >
      {t?.product?.add_to_cart
        ? `${t.product.add_to_cart} — ${price.toLocaleString("ru-RU")} ֏`
        : `Add to cart — ${price.toLocaleString("ru-RU")} ֏`}
    </button>
  );
}
