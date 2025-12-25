"use client";
import Link from "next/link";
import { useCart } from "../providers/CartProvider";
export default function Footer({ t }: { t: any }) {
  const { lang } = useCart();
  const base = `/${lang}`;
  return (
    <footer className="floral-footer">
      <div className="floral-footer-top">
        <Link className="floral-footer-logo" href={base}>
          mussa
        </Link>
        <p>{t.footer.tagline}</p>
        <a
          href="https://www.instagram.com/mussa.floralstudio/"
          target="_blank"
          rel="noreferrer"
        >
          INSTAGRAM ↗
        </a>
      </div>
      <div className="floral-footer-bottom">
        <span>© {new Date().getFullYear()} MUSSA FLORAL STUDIO</span>
        <nav aria-label="Footer navigation">
          <Link href={`${base}/shop`}>{t.nav.shop}</Link>
          <Link href={`${base}/about`}>{t.nav.about}</Link>
          <Link href={`${base}/contact`}>{t.nav.contact}</Link>
          <Link href={`${base}/admin/login`}>
            {lang === "ru" ? "Вход" : lang === "hy" ? "Մուտք" : "Admin login"}
          </Link>
        </nav>
        <span>YEREVAN, ARMENIA</span>
      </div>
    </footer>
  );
}
