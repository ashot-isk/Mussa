import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ui, Lang } from "../../i18n/config";

export default function VendingPage({ params }: { params: { lang: Lang } }) {
  const t = ui[params.lang];
  const isRu = params.lang === "ru";
  const isHy = params.lang === "hy";

  return (
    <>
      <Header t={t} />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl md:text-4xl mb-6">
          {t.vending.heading}
        </h1>
        <div className="rounded-3xl overflow-hidden bg-bgSecondary shadow mb-8">
          <img
            src="/vending/Vending_Image.jpeg"
            alt="mussa vending machine"
            className="w-full"
          />
        </div>
        <h2 className="font-serif text-2xl mb-2">{t.vending.dimensions}</h2>
        <ul className="list-disc ml-6 text-sm text-dark/80 space-y-1 mb-6">
          <li>Height: 230 mm</li>
          <li>Width: 187 mm</li>
          <li>Depth: 90 mm</li>
          <li>Clearance: 10 mm around</li>
        </ul>
        <h2 className="font-serif text-2xl mb-2">{t.vending.power}</h2>
        <ul className="list-disc ml-6 text-sm text-dark/80 space-y-1 mb-6">
          <li>220–240V AC, 50/60 Hz</li>
          <li>Max load: 1.2 kW</li>
          <li>Standard grounded socket</li>
        </ul>
        <h2 className="font-serif text-2xl mb-2">{t.vending.service}</h2>
        <ul className="list-disc ml-6 text-sm text-dark/80 space-y-1 mb-6">
          <li>
            {isRu
              ? "Контроль температуры внутри камеры: +2…+6°C ежедневно."
              : isHy
              ? "Մշտական ջերմաստիճանի վերահսկում՝ +2…+6°C։"
              : "Daily temperature check: +2…+6°C."}
          </li>
          <li>
            {isRu
              ? "Обновление цветов каждые 24–48 часов."
              : isHy
              ? "Ծաղիկների թարմացում՝ յուրաքանչյուր 24–48 ժամում։"
              : "Flower refill every 24–48 hours."}
          </li>
          <li>
            {isRu
              ? "Опционально — модуль удалённого мониторинга."
              : isHy
              ? "Հնարավոր է հեռավար մոնիթորինգի մոդուլ։"
              : "Optional remote monitoring module."}
          </li>
        </ul>
      </main>
      <Footer t={t} />
    </>
  );
}
