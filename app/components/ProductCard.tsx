"use client";

import Link from "next/link";
import { useCart } from "../providers/CartProvider";
import { Lang, ui, defaultLang } from "../i18n/config";

type Props = {
  id: string;
  name: string;
  price: number;
  image: string;
  lang?: Lang;
};

export default function ProductCard({ id, name, price, image, lang }: Props) {
  const { addItem } = useCart();
  const langUsed = lang ?? defaultLang;
  const t = ui[langUsed];

  return (
    <article className="group bg-white rounded-lg overflow-hidden shadow-subtle hover:shadow-card transition-shadow duration-300">
      <Link
        href={`/${lang}/product/${id}`}
        className="block"
        aria-label={`Open ${name} product page`}
      >
        <div className="overflow-hidden h-80 bg-bgSecondary">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6">
          <div className="font-serif text-xl leading-tight mb-2">{name}</div>
          <div className="text-lg font-medium text-dark">
            {price.toLocaleString("ru-RU")} ֏
          </div>
        </div>
      </Link>
      <div className="p-6 pt-0">
        <button
          onClick={() => addItem({ id, name, price, qty: 1 })}
          className="w-full rounded-full bg-black text-white text-xs uppercase tracking-[0.12em] py-3 font-medium hover:bg-black/90 transition-colors"
        >
          {t?.product?.add_to_cart || "Add to cart"}
        </button>
      </div>
    </article>
  );
}
