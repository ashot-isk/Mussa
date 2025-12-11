"use client";

import { useCart } from "../providers/CartProvider";

export default function Footer({ t }: { t: any }) {
  const { lang } = useCart();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-black/10 mt-24">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-black/10">
          <div>
            <img
              src="/mussa logo files/musa logo black transparent.png"
              alt="mussa"
              className="h-20 w-auto mb-4"
            />
            <p className="text-dark/60 leading-relaxed text-sm">
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <div className="font-semibold mb-4 text-sm uppercase tracking-[0.1em]">
              {t.footer?.shop_title ||
                (lang === "ru" ? "Магазин" : lang === "hy" ? "Խանութ" : "Shop")}
            </div>
            <p className="text-dark/60 text-sm">
              {t.footer?.shop_desc || "Bouquets, boxes, seasonal flowers."}
            </p>
          </div>
          <div>
            <div className="font-semibold mb-4 text-sm uppercase tracking-[0.1em]">
              {t.footer?.about_title ||
                (lang === "ru"
                  ? "О нас"
                  : lang === "hy"
                  ? "Մեր մասին"
                  : "About")}
            </div>
            <p className="text-dark/60 text-sm">
              {t.footer?.about_desc || "Soft luxury floral studio."}
            </p>
          </div>
          <div>
            <div className="font-semibold mb-4 text-sm uppercase tracking-[0.1em]">
              {t.footer?.contact_title ||
                (lang === "ru"
                  ? "Контакты"
                  : lang === "hy"
                  ? "Կապ"
                  : "Contact")}
            </div>
            <p className="text-dark/60 text-sm">
              {t.footer?.contact_desc || "Instagram: @mussa.floralstudio"}
            </p>
          </div>
        </div>
        <div className="text-xs text-dark/50 text-center">
          {t.footer?.copyright
            ? t.footer.copyright.replace("{year}", String(year))
            : `© ${year} mussa Floral Studio. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
