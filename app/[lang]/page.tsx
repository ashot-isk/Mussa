import Header from "../components/Header";
import Footer from "../components/Footer";
import { ui, Lang, defaultLang } from "../i18n/config";
import ProductCard from "../components/ProductCard";

export default function Home({ params }: { params: { lang: Lang } }) {
  const lang: Lang =
    params?.lang && ui[params.lang] ? params.lang : defaultLang;
  const t = ui[lang];

  return (
    <>
      <Header t={t} />
      <main>
        <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl">{t.hero.title}</h1>
            <p className="mt-4 text-dark/70">{t.hero.subtitle}</p>
            <div className="mt-6 flex gap-4 flex-wrap">
              <a
                href={`/${params.lang}/shop`}
                className="px-6 py-3 bg-accent text-white rounded-full text-xs uppercase tracking-[0.12em]"
              >
                {t.hero.shop}
              </a>
              <a
                href={`/${params.lang}/shop`}
                className="px-6 py-3 border border-dark rounded-full text-xs uppercase tracking-[0.12em]"
              >
                {t.hero.seasonal}
              </a>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden bg-bgSecondary shadow">
            <img
              src="/images/hero.jpg"
              alt="MUSSA bouquet"
              className="w-full h-full object-cover"
            />
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-serif text-2xl">Trending now</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <ProductCard
              id="peony"
              name="Pastel Peony Dream"
              price={48000}
              image="https://images.unsplash.com/photo-1509043759401-136742328bb3?auto=format&fit=crop&w=900&q=80"
            />
            <ProductCard
              id="white-roses"
              name="White Garden Roses"
              price={39000}
              image="https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=900&q=80"
            />
            <ProductCard
              id="box"
              name="MUSSA Signature Box"
              price={55000}
              image="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80"
            />
          </div>
        </section>
      </main>
      <Footer t={t} />
    </>
  );
}
