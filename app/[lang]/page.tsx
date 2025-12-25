"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ui, Lang, defaultLang } from "../i18n/config";

const copy = {
  en: {
    eyebrow: "A LITTLE WILD. ALWAYS PERSONAL.",
    hero: [
      "Say it with flowers.",
      "A softer kind of luxury.",
      "Let something beautiful bloom.",
    ],
    discover: "Discover the collection",
    popular: "THE MUSSA EDIT",
    all: "Explore all flowers",
    collections: "FLOWERS, YOUR WAY",
    story: "MORE THAN FLOWERS.\nA FEELING.",
    body: "For the big moments. For the just-because moments. We bring together unexpected colours, beautiful textures and a little bit of wildness. Every arrangement has its own story. Let’s find yours.",
    about: "Meet Mussa",
    names: [
      "The romantic",
      "The garden muse",
      "A little wild",
      "The signature",
    ],
    tags: [
      "PEONIES & ROSES",
      "SOFT & SEASONAL",
      "MEADOW-INSPIRED",
      "BOLD & BEAUTIFUL",
    ],
    collectionNames: ["Everyday, extraordinary", "Made for your moment"],
    collectionSub: [
      "A little beauty, just because.",
      "Flowers that say everything.",
    ],
    note: "Thoughtfully composed. Beautifully yours.",
    shop: "Shop the collection",
    fresh: "FROM THE STUDIO",
    footer: "Flowers that speak for you.",
  },
  ru: {
    eyebrow: "НЕМНОГО ДИКОСТИ. МНОГО ЧУВСТВ.",
    hero: [
      "Скажите это цветами.",
      "Нежное искусство роскоши.",
      "Пусть расцветает прекрасное.",
    ],
    discover: "Смотреть коллекцию",
    popular: "ВЫБОР MUSSA",
    all: "Все цветы",
    collections: "ЦВЕТЫ В ВАШЕМ СТИЛЕ",
    story: "БОЛЬШЕ ЧЕМ ЦВЕТЫ.\nЧУВСТВА.",
    body: "Для важных событий. И просто так. Мы соединяем неожиданные оттенки, выразительные фактуры и немного дикой природы. У каждой композиции своя история. Найдём вашу.",
    about: "О студии",
    names: ["Романтика", "Садовая муза", "Дикая нежность", "Почерк Mussa"],
    tags: [
      "ПИОНЫ И РОЗЫ",
      "НЕЖНОСТЬ СЕЗОНА",
      "ВДОХНОВЕНИЕ ЛУГОМ",
      "ЯРКИЙ ХАРАКТЕР",
    ],
    collectionNames: ["Прекрасное каждый день", "Для вашего момента"],
    collectionSub: [
      "Немного красоты. Просто так.",
      "Цветы, которые говорят обо всём.",
    ],
    note: "Собраны с чувством. Созданы для вас.",
    shop: "Смотреть коллекцию",
    fresh: "ИЗ СТУДИИ",
    footer: "Цветы, которые говорят за вас.",
  },
  hy: {
    eyebrow: "ՄԻ ՓՈՔՐ ՎԱՅՐԻ։ ՄԻՇՏ ԱՆՁՆԱԿԱՆ։",
    hero: [
      "Ասեք ծաղիկներով։",
      "Շքեղության նուրբ արվեստը։",
      "Թող գեղեցիկը ծաղկի։",
    ],
    discover: "Բացահայտել հավաքածուն",
    popular: "MUSSA-Ի ԸՆՏՐԱՆԻՆ",
    all: "Բոլոր ծաղիկները",
    collections: "ԾԱՂԻԿՆԵՐ՝ ՁԵՐ ՈՃՈՎ",
    story: "ԱՎԵԼԻՆ, ՔԱՆ ԾԱՂԻԿՆԵՐ։\nԶԳԱՑՄՈՒՆՔ։",
    body: "Կարևոր պահերի համար։ Եվ պարզապես այդպես։ Մենք միավորում ենք անսպասելի գույները, գեղեցիկ հյուսվածքներն ու բնության շունչը։ Յուրաքանչյուր կոմպոզիցիա ունի իր պատմությունը։ Գտնենք ձերը։",
    about: "Մեր մասին",
    names: [
      "Ռոմանտիկա",
      "Այգու մուսան",
      "Վայրի քնքշություն",
      "Mussa-ի ձեռագիրը",
    ],
    tags: [
      "ՔԱՋՎԱՐԴԵՐ ԵՎ ՎԱՐԴԵՐ",
      "ՍԵԶՈՆԻ ՔՆՔՇՈՒԹՅՈՒՆԸ",
      "ՄԱՐԳԱԳԵՏՆԻ ՇՈՒՆՉԸ",
      "ՎԱՌ ԵՎ ԳԵՂԵՑԻԿ",
    ],
    collectionNames: ["Գեղեցիկն ամեն օր", "Ձեր պահի համար"],
    collectionSub: [
      "Մի փոքր գեղեցկություն՝ պարզապես այդպես։",
      "Ծաղիկներ, որոնք ասում են ամեն ինչ։",
    ],
    note: "Սիրով հավաքված։ Ձեզ համար ստեղծված։",
    shop: "Դիտել հավաքածուն",
    fresh: "ՍՏՈՒԴԻԱՅԻՑ",
    footer: "Ծաղիկներ, որոնք խոսում են ձեր փոխարեն։",
  },
};
const photos = ["rose", "garden", "meadow", "signature"];
type Product = {
  stock: number;
  isAvailable: boolean;
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

export default function Home({ params }: { params: { lang: Lang } }) {
  const lang = ui[params.lang] ? params.lang : defaultLang;
  const c = copy[lang];
  const [slide, setSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const base = `/${lang}`;
  useEffect(() => {
    const controller = new AbortController();
    fetch("http://localhost:5074/api/products", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setProducts(data.slice(0, 4));
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <>
      <Header t={ui[lang]} />
      <main className="floral-home">
        <section
          className={`floral-hero campaign-${slide}`}
          aria-label={c.hero[slide]}
        >
          <img
            key={slide}
            className="floral-hero-photo"
            src={`/editorial/${["rose", "garden", "meadow"][slide]}.webp`}
            alt={c.hero[slide]}
            fetchPriority="high"
          />
          <div className="floral-hero-copy">
            <p className="floral-eyebrow">{c.eyebrow}</p>
            <h1>mussa</h1>
            <p className="floral-hero-title">{c.hero[slide]}</p>
            <Link href={`${base}/shop`} className="floral-underline">
              {c.discover}
              <span>↗</span>
            </Link>
          </div>
          <div className="floral-slide-controls">
            <span>0{slide + 1} / 03</span>
            <div className="floral-slide-tabs">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  aria-label={`${c.hero[i]} — ${i + 1}`}
                  aria-pressed={slide === i}
                  onClick={() => setSlide(i)}
                  className={slide === i ? "active" : ""}
                />
              ))}
            </div>
            <button
              aria-label="Previous slide"
              onClick={() => setSlide((slide + 2) % 3)}
            >
              ←
            </button>
            <button
              aria-label="Next slide"
              onClick={() => setSlide((slide + 1) % 3)}
            >
              →
            </button>
          </div>
        </section>
        <section className="floral-section">
          <div className="floral-section-heading">
            <h2>{c.popular}</h2>
            <Link href={`${base}/shop`} aria-label={c.all}>
              <span>{c.all}</span>
              <b>⟶</b>
            </Link>
          </div>
          <div className="floral-product-grid">
            {products.length
              ? products.map((product, i) => (
                  <Link
                    key={product.id}
                    href={`${base}/product/${product.id}`}
                    className="floral-product"
                  >
                    <div className="floral-product-image">
                      <img
                        src={
                          product.imageUrl
                            ? product.imageUrl.startsWith("http")
                              ? product.imageUrl
                              : `http://localhost:5074${product.imageUrl}`
                            : `/editorial/${photos[i]}.webp`
                        }
                        alt={product.name}
                        loading="lazy"
                      />
                      <span className="floral-image-tag">
                        {product.stock <= 0 || !product.isAvailable
                          ? ui[lang].product.out_of_stock
                          : "MUSSA"}
                      </span>
                      <span className="floral-image-arrow">↗</span>
                    </div>
                    <div className="floral-product-meta">
                      <h3>{product.name}</h3>
                      <p>
                        {new Intl.NumberFormat(
                          lang === "hy"
                            ? "hy-AM"
                            : lang === "ru"
                              ? "ru-RU"
                              : "en-US",
                        ).format(product.price)}{" "}
                        ֏
                      </p>
                    </div>
                  </Link>
                ))
              : photos.map((photo, i) => (
                  <Link
                    key={photo}
                    href={`${base}/shop`}
                    className="floral-product"
                  >
                    <div className="floral-product-image">
                      <img
                        src={`/editorial/${photo}.webp`}
                        alt={c.names[i]}
                        loading="lazy"
                      />
                      <span className="floral-image-tag">{c.tags[i]}</span>
                      <span className="floral-image-arrow">↗</span>
                    </div>
                    <div className="floral-product-meta">
                      <h3>{c.names[i]}</h3>
                      <p>{c.shop} ↗</p>
                    </div>
                  </Link>
                ))}
          </div>
        </section>
        <section className="floral-section floral-collections">
          <div className="floral-section-heading">
            <h2>{c.collections}</h2>
            <span className="floral-small-note">{c.note}</span>
          </div>
          <div className="floral-collection-grid">
            {["field", "garden"].map((photo, i) => (
              <Link
                key={photo}
                href={`${base}/shop`}
                className="floral-collection"
              >
                <img
                  src={`/editorial/${photo}.webp`}
                  alt={c.collectionNames[i]}
                  loading="lazy"
                />
                <div>
                  <p>{c.collectionSub[i]}</p>
                  <h3>
                    {c.collectionNames[i]} <span>↗</span>
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="floral-story">
          <div className="floral-story-image">
            <img
              src="/editorial/studio.webp"
              alt="Mussa floral arrangement in the studio"
              loading="lazy"
            />
            <span>THE ART OF GIVING</span>
          </div>
          <div className="floral-story-copy">
            <p className="floral-eyebrow">MUSSA FLORAL STUDIO · YEREVAN</p>
            <h2>{c.story}</h2>
            <p>{c.body}</p>
            <Link className="floral-underline" href={`${base}/about`}>
              {c.about}
              <span>↗</span>
            </Link>
          </div>
        </section>
        <section className="floral-signoff">
          <p>{c.note}</p>
          <Link href={`${base}/shop`}>
            {c.shop}
            <span>⟶</span>
          </Link>
        </section>
      </main>
      <Footer t={ui[lang]} />
    </>
  );
}
