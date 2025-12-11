import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ui, Lang } from "../../i18n/config";

export default function AboutPage({ params }: { params: { lang: Lang } }) {
  const t = ui[params.lang];
  const isRu = params.lang === "ru";
  const isHy = params.lang === "hy";
  function RenderBrandText({ text }: { text: string }) {
    const parts = text.split("mussa");
    return (
      <>
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className="brand-font">mussa</span>
            )}
          </span>
        ))}
      </>
    );
  }

  return (
    <>
      <Header t={t} />
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-serif text-3xl mb-4">
              <RenderBrandText
                text={
                  isRu
                    ? "История mussa"
                    : isHy
                    ? "mussa-ի պատմությունը"
                    : "The story of mussa"
                }
              />
            </h1>
            <p className="text-sm text-dark/80 mb-3">
              <RenderBrandText
                text={
                  isRu
                    ? "mussa — это цветочная студия в нюдовых пастельных оттенках, где каждый букет создаётся как маленький арт-объект."
                    : isHy
                    ? "mussa-ն նյուդ պաստելային գույներով ծաղկային ստուդիա է, որտեղ յուրաքանչյուր համադրություն ստեղծվում է որպես փոքրիկ արվեստի գործ։"
                    : "mussa is a floral studio in nude pastel tones, where every bouquet is crafted as a small art piece."
                }
              />
            </p>
            <p className="text-sm text-dark/80">
              {isRu
                ? "Мы выбираем только премиальные цветы, работаем в мягкой, воздушной эстетике и уделяем внимание каждой детали — от композиции до упаковки."
                : isHy
                ? "Մենք ընտրում ենք միայն պրեմիում ծաղիկներ, աշխատում ենք նուրբ, օդային էսթետիկայով և ուշադրություն ենք դարձնում յուրաքանչյուր մանրուքի՝ կոմպոզիցիայից մինչև փաթեթավորում։"
                : "We work with premium blooms, soft airy aesthetics and careful details from composition to packaging."}
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden bg-bgSecondary shadow">
            <img
              src="https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=1200&q=80"
              alt="Studio"
            />
          </div>
        </section>
      </main>
      <Footer t={t} />
    </>
  );
}
