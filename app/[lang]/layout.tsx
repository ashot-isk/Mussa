import CartProvider from "../providers/CartProvider";
import AuthProvider from "../providers/AuthProvider";
import { languages, defaultLang, Lang } from "../i18n/config";

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Lang };
}) {
  const lang = languages.includes(params.lang) ? params.lang : defaultLang;
  return (
    <AuthProvider>
      <CartProvider lang={lang}>{children}</CartProvider>
    </AuthProvider>
  );
}
