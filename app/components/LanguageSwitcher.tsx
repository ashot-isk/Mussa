"use client";

import { usePathname, useRouter } from "next/navigation";
import { languages, Lang } from "../i18n/config";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLang = (lang: Lang) => {
    const segments = pathname.split("/");
    segments[1] = lang;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex gap-2 text-xs">
      {languages.map(lang => (
        <button
          key={lang}
          onClick={() => changeLang(lang)}
          className="px-2 py-1 rounded-full hover:text-accent"
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
