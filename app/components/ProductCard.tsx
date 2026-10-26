"use client";

import Link from "next/link";
import AddToCart from "./AddToCart";
import { Lang, defaultLang } from "../i18n/config";

type Props = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isAvailable?: boolean;
  image: string;
  lang?: Lang;
  categoryName?: string;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  lang,
  categoryName,
  stock,
  isAvailable,
}: Props) {
  const langUsed = lang ?? defaultLang;

  return (
    <article className="group bg-white rounded-lg overflow-hidden shadow-subtle hover:shadow-card transition-shadow duration-300">
      <Link
        href={`/${langUsed}/product/${id}`}
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
          {categoryName && (
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              {categoryName}
            </div>
          )}
          <div className="font-serif text-xl leading-tight mb-2">{name}</div>
          <div className="text-lg font-medium text-dark">
            {price.toLocaleString("ru-RU")} ֏
          </div>
        </div>
      </Link>
      <div className="p-6 pt-0">
        <AddToCart
          id={id}
          name={name}
          price={price}
          stock={stock}
          isAvailable={isAvailable}
          lang={langUsed}
        />
      </div>
    </article>
  );
}
