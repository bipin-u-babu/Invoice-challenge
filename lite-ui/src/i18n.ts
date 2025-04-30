import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./translations/en_GB.json";
import fr from "./translations/fr_FR.json";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)

  .init({
    detection: {
      order: ["querystring", "navigator"],
      lookupQuerystring: "lang",
    },

    supportedLngs: ["en", "fr"],
    fallbackLng: "en",
    nonExplicitSupportedLngs: true,
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
  });

export default i18next;
