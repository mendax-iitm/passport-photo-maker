import { useState } from 'react'
import translations from '../translations/ui.json'

const DEFAULT_LANGUAGE = "en"
const SUPPORTED_LANGUAGES = ["en", "hi"]

export const useLanguage = () => {
  const getInitialLanguage = () => {
    const saved = localStorage.getItem('language')
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved
    }
    return DEFAULT_LANGUAGE
  }

  const [language, setLanguage] = useState(getInitialLanguage())

  const translate = (key) => {
    try {
      return translations[key][language]
    } catch (error) {
      console.error(`Translation missing for key: ${key} in language: ${language}`)
      return key
    }
  }

  const translateObject = (obj) => {
    try {
      return obj[language]
    } catch (error) {
      console.error(`Translation missing for object in language: ${language}`)
      return JSON.stringify(obj)
    }
  }

  const getLanguage = () => language

  const handleSetLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  return {
    translate,
    translateObject,
    setLanguage: handleSetLanguage,
    getLanguage
  }
}