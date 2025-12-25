"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "../providers/CartProvider";

export default function Header({ t }: { t: any }) {
  const { items, lang } = useCart();
  const [open, setOpen] = useState(false);
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const base = `/${lang}`;
  const labels =
    lang === "ru"
      ? ["Цветы с характером. Созданы в Ереване.", "Войти", "Корзина", "Меню"]
      : lang === "hy"
        ? [
            "Բնավորությամբ ծաղիկներ՝ ստեղծված Երևանում։",
            "Մուտք",
            "Զամբյուղ",
            "Մենյու",
          ]
        : [
            "Flowers with feeling. Made in Yerevan.",
            "Account",
            "Shopping bag",
            "Menu",
          ];
  return (
    <header className="floral-header">
      <div className="floral-announcement">{labels[0]}</div>
      <div className="floral-nav">
        <Link href={base} className="floral-logo" aria-label="Mussa home">
          mussa<span>FLORAL STUDIO</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className={`floral-links ${open ? "is-open" : ""}`}
        >
          {[
            ["shop", t.nav.shop],
            ["about", t.nav.about],
            ["contact", t.nav.contact],
            ["vending", t.nav.vending],
          ].map(([path, label]) => (
            <Link
              key={path}
              href={`${base}/${path}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="floral-actions">
          <Link
            href={`${base}/admin/login`}
            aria-label={labels[1]}
            title={labels[1]}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M4 22v-3a8 8 0 0 1 16 0v3" />
            </svg>
          </Link>
          <Link
            href={`${base}/checkout`}
            aria-label={`${labels[2]} (${count})`}
            className="floral-bag"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M4 7h16l-1.5 15h-13L4 7Z" />
              <path d="M8 8V5a4 4 0 0 1 8 0v3" />
            </svg>
            <span>{count}</span>
          </Link>
          <LanguageSwitcher />
          <button
            className="floral-menu"
            onClick={() => setOpen(!open)}
            aria-label={labels[3]}
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
