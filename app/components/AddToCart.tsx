"use client";

import { useCart } from "../providers/CartProvider";
import { ui, Lang } from "../i18n/config";

type Props = {
  id: string;
  name: string;
  price: number;
  lang: Lang;
  stock: number;
  isAvailable?: boolean;
};

export default function AddToCart({
  id,
  name,
  price,
  lang,
  stock,
  isAvailable = true,
}: Props) {
  const { addItem, items } = useCart();
  const outOfStock = !isAvailable || stock <= 0;
  const atLimit = (items.find((item) => item.id === id)?.qty ?? 0) >= stock;
  const t = ui[lang];

  return (
    <button
      disabled={outOfStock || atLimit}
      onClick={() => addItem({ id, name, price, qty: 1, stock })}
      className="w-full md:w-auto rounded-full bg-black text-white text-sm uppercase tracking-[0.12em] py-3 px-6 font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {outOfStock
        ? t.product.out_of_stock
        : atLimit
          ? t.product.bag_limit
          : `${t.product.add_to_bag} — ${price.toLocaleString("ru-RU")} ֏`}
    </button>
  );
}
