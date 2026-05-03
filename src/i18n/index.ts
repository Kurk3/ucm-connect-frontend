// Import slovenských prekladov
import { sk } from './sk'

// Typ pre preklady
type TranslationParams = Record<string, string | number>

// Aktuálny jazyk (zatiaľ len SK)
const currentLanguage = 'sk' as const

// Mapa prekladov
const translations = {
  sk: sk
}

/**
 * Získa preklad pre daný kľúč
 * @param key - Kľúč prekladu (napr. 'auth.login.title')
 * @param params - Parametre na nahradenie v texte
 * @returns Preložený text
 */
export function t(key: string, params: TranslationParams = {}): string {
  const keys = key.split('.')
  let value: any = translations[currentLanguage]

  // Naviguj cez objekty podľa kľúča
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key
    }
  }

  // Ak je hodnota string, nahraď parametre
  if (typeof value === 'string') {
    let result = value
    for (const [param, val] of Object.entries(params)) {
      result = result.replace(`{${param}}`, String(val))
    }
    return result
  }

  return key
}

// Composable pre Vue komponenty
export function useTranslations() {
  return {
    t
  }
}

// Export všetkých prekladov pre debugging
export { sk }