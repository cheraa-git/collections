import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './en.json'
import ru from './ru.json'

const resources = { en, ru }
i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  },
  supportedLngs: ['en', 'ru']
});


export default i18n;
