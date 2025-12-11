import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ui, Lang } from "../../i18n/config";

export default function ContactPage({ params }: { params: { lang: Lang } }) {
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
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl mb-4">
          <RenderBrandText
            text={
              isRu ? "Контакты" : isHy ? "Կապ mussa-ի հետ" : "Contact mussa"
            }
          />
        </h1>
        <p className="text-sm text-dark/70 mb-6">
          {isRu
            ? "Оставьте заявку или напишите нам, и мы поможем подобрать идеальные цветы."
            : isHy
            ? "Գրեք մեզ կամ թողեք հաղորդագրություն, և մենք կօգնենք ընտրել կատարյալ ծաղիկներ։"
            : "Send us a message and we will help you choose the perfect flowers."}
        </p>
        <div className="grid md:grid-cols-3 gap-5 mb-10 text-sm">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-1">
              {isRu ? "Студия" : isHy ? "Ստուդիա" : "Studio"}
            </div>
            <p>
              Yerevan, Armenia
              <br />
              Mon–Sun: 10:00 – 20:00
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-1">
              {isRu ? "Телефон" : isHy ? "Հեռախոս" : "Phone"}
            </div>
            <p>
              +374 XX XXX XXX
              <br />
              WhatsApp / Telegram
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-1">Email</div>
            <p>hello@mussa.am</p>
          </div>
        </div>
        <form className="bg-white rounded-xl shadow p-5 space-y-3 text-sm">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">
                {isRu ? "Имя" : isHy ? "Անուն" : "Name"}
              </label>
              <input
                className="border border-black/10 rounded px-3 py-2 w-full"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block mb-1">
                {isRu ? "Телефон" : isHy ? "Հեռախոս" : "Phone"}
              </label>
              <input
                className="border border-black/10 rounded px-3 py-2 w-full"
                placeholder="+374 ..."
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              className="border border-black/10 rounded px-3 py-2 w-full"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block mb-1">
              {isRu ? "Сообщение" : isHy ? "Հաղորդագրություն" : "Message"}
            </label>
            <textarea className="border border-black/10 rounded px-3 py-2 w-full min-h-[120px]" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-accent text-white rounded-full text-xs uppercase tracking-[0.12em]"
          >
            {isRu ? "Отправить" : isHy ? "Ուղարկել" : "Send"}
          </button>
        </form>
      </main>
      <Footer t={t} />
    </>
  );
}
