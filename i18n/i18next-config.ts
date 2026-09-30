'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonEn from './lang/common.en'
import appEn from './lang/app.en'
import toolsEn from './lang/tools.en'

import type { Locale } from '.'

// English only. To add a language: create ./lang/{common,app,tools}.<code>.ts,
// register it below and add the code to `locales` in ./index.ts.
const resources = {
  en: {
    translation: {
      common: commonEn,
      app: appEn,
      tools: toolsEn,
    },
  },
}

i18n.use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources,
  })

export const changeLanguage = (lan: Locale) => {
  i18n.changeLanguage(lan)
}
export default i18n
