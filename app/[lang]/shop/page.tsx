import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ui, Lang } from "../../i18n/config";
import ProductCard from "../../components/ProductCard";

export default function ShopPage({ params }: { params: { lang: Lang } }) {
  const t = ui[params.lang];

  return (
    <>
      <Header t={t} />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl mb-6">{t.nav?.shop || "Shop"}</h1>
        <div className="grid md:grid-cols-3 gap-5">
          <ProductCard
            id="peony"
            name={t.product?.products?.peony?.title || "Pastel Peony Dream"}
            price={48000}
            image="/product images/119A1411.JPG"
            lang={params.lang}
          />
          <ProductCard
            id="white-roses"
            name={
              t.product?.products?.["white-roses"]?.title ||
              "White Garden Roses"
            }
            price={39000}
            image="/product images/119A6070.JPG"
            lang={params.lang}
          />
          <ProductCard
            id="box"
            name={t.product?.products?.box?.title || "mussa Signature Box"}
            price={55000}
            image="/product images/119A6415.JPG"
            lang={params.lang}
          />
        </div>
      </main>
      <Footer t={t} />
    </>
  );
}
