export const languages = ["en", "ru", "hy"] as const;
export type Lang = (typeof languages)[number];

export const defaultLang: Lang = "en";

import en from "./en.json";
import ru from "./ru.json";
import hy from "./hy.json";

export const ui: Record<Lang, any> = {
  en,
  ru,
  hy,
};
