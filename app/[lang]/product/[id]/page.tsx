import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import AddToCart from "../../../components/AddToCart";
import { ui, Lang } from "../../../i18n/config";

type Params = { params: { lang: Lang; id: string } };

const PRODUCT_DB: Record<string, any> = {
  peony: {
    title: "Pastel Peony Dream",
    price: 48000,
    images: ["/product images/119A1411.JPG"],
    description:
      "A soft, romantic arrangement of peonies in pastel shades — perfect for anniversaries and special moments.",
    composition: ["Peony", "Filler greens"],
  },
  "white-roses": {
    title: "White Garden Roses",
    price: 39000,
    images: ["/product images/119A6070.JPG"],
    description: "Classic white garden roses arranged with delicate greenery.",
    composition: ["Roses", "Eucalyptus"],
  },
  box: {
    title: "mussa Signature Box",
    price: 55000,
    images: ["/product images/119A6415.JPG"],
    description:
      "Our signature boxed arrangement — premium stems presented in a luxury box.",
    composition: ["Seasonal flowers", "Box packaging"],
  },
};

export default function ProductPage({ params }: Params) {
  const t = ui[params.lang];
  const id = params.id;

  const product = PRODUCT_DB[id] || {
    title: id.replace(/-/g, " "),
    price: 0,
    images: ["/images/MussaMain.JPG"],
    description: t?.product?.placeholder || "Product description coming soon.",
    composition: [],
  };

  return (
    <>
      <Header t={t} />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="rounded-xl overflow-hidden shadow-card">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="font-serif text-3xl">{product.title}</h1>
            <div className="text-2xl font-medium text-dark">
              {product.price
                ? product.price.toLocaleString("ru-RU") + " ֏"
                : "—"}
            </div>
            <p className="text-dark/70">{product.description}</p>

            <div>
              <h3 className="font-medium mb-2">
                {t.product?.composition || "Composition"}
              </h3>
              <ul className="list-disc pl-5 text-dark/70">
                {product.composition.map((c: string) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <AddToCart
                id={id}
                name={product.title}
                price={product.price}
                lang={params.lang}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer t={t} />
    </>
  );
}
