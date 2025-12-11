"use client";

import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "../providers/CartProvider";

export default function Header({ t }: { t: any }) {
  const { items, lang } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const base = `/${lang}`;

  return (
    <header className="sticky top-0 z-50 bg-bgMain border-b border-black/10">
      <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
        <Link href={base} className="flex items-center">
          <img
            src="/mussa logo files/musa logo black transparent.png"
            alt="mussa"
            className="h-32 w-auto"
          />
        </Link>
        <nav className="hidden md:flex gap-12 text-xs uppercase tracking-[0.14em] text-dark/70">
          <Link href={base} className="hover:text-dark transition">
            {t.nav.home}
          </Link>
          <Link href={`${base}/shop`} className="hover:text-dark transition">
            {t.nav.shop}
          </Link>
          <Link href={`${base}/about`} className="hover:text-dark transition">
            {t.nav.about}
          </Link>
          <Link href={`${base}/contact`} className="hover:text-dark transition">
            {t.nav.contact}
          </Link>
          <Link href={`${base}/vending`} className="hover:text-dark transition">
            {t.nav.vending}
          </Link>
          <Link
            href={`${base}/checkout`}
            className="flex items-center gap-2 hover:text-dark transition"
          >
            🛒 <span className="font-medium">{count}</span>
          </Link>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
