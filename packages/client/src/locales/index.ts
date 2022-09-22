import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Flags from 'country-flag-icons/react/3x2'

// 注意，该字典在多个地方使用，请谨慎修改
export const localeDict = [
  {
    fileName: 'zh-CN',
    cnName: '简体中文',
    name: '简体中文',
    alias: ['zh-CN', 'zh_CN', 'zh'],
    // permission: 360,
    codeTransferToServer: 0,
    languageIcons: '🇨🇳',
    countryFlagIcons: Flags.CN
  },
  {
    fileName: 'en-US',
    cnName: '英语',
    name: 'English',
    alias: ['en-US', 'en_US', 'en'],
    // permission: 361,
    codeTransferToServer: 4,
    languageIcons: '🇺🇸',
    countryFlagIcons: Flags.US
  },
  {
    fileName: 'id-ID',
    cnName: '印度尼西亚语',
    name: 'Bahasa Indonesia',
    alias: ['id-ID', 'id_ID', 'in_ID', 'id'],
    // permission: 362,
    codeTransferToServer: 1,
    languageIcons: '🇮🇩',
    countryFlagIcons: Flags.ID
  },
  {
    fileName: 'vi-VN',
    cnName: '越南语',
    name: 'Tiếng Việt',
    alias: ['vi-VN', 'vi_VN', 'vi', 'vn'],
    // permission: 363,
    codeTransferToServer: '4',
    languageIcons: '🇻🇳',
    countryFlagIcons: Flags.VN
  },
  {
    fileName: 'ms-MY',
    cnName: '马来语',
    name: 'بهاس ملايو‎',
    // permission: 364,
    alias: ['ms-MY', 'ms_MY', 'my', 'ms'],
    codeTransferToServer: 2,
    languageIcons: '🇲🇾',
    countryFlagIcons: Flags.MY
  },
  {
    fileName: 'es-ES',
    cnName: '西班牙语',
    name: 'Español',
    // permission: 364,
    alias: ['es-ES', 'es_ES'],
    codeTransferToServer: 7,
    languageIcons: '🇪🇸',
    countryFlagIcons: Flags.ES
  },
  {
    fileName: 'fr-FR',
    cnName: '法语-法国',
    name: 'Français',
    // permission: 364,
    alias: ['fr-FR', 'fr_FR'],
    codeTransferToServer: 8,
    languageIcons: '🇫🇷',
    countryFlagIcons: Flags.FR
  },
  {
    fileName: 'fr-BE',
    cnName: '法语-比利时',
    name: 'Français',
    // permission: 364,
    alias: ['fr-BE', 'fr_BE'],
    codeTransferToServer: 10,
    languageIcons: '🇧🇪',
    countryFlagIcons: Flags.BE
  },
  {
    fileName: 'it-IT',
    cnName: '意大利语',
    name: 'Italiano',
    // permission: 364,
    alias: ['it-IT', 'it_IT'],
    codeTransferToServer: 9,
    languageIcons: '🇮🇹',
    countryFlagIcons: Flags.IT
  },
  {
    fileName: 'pl-PL',
    cnName: '波兰语',
    name: 'Polski',
    // permission: 364,
    alias: ['pl-PL', 'pl_PL'],
    codeTransferToServer: 26,
    languageIcons: '🇵🇱',
    countryFlagIcons: Flags.PL
  },
  {
    fileName: 'de-DE',
    cnName: '德语',
    name: 'Deutsch',
    // permission: 364,
    alias: ['de-DE', 'de_DE'],
    codeTransferToServer: null,
    languageIcons: '🇩🇪',
    countryFlagIcons: Flags.DE
  },
  {
    fileName: 'da-DK',
    cnName: '丹麦语',
    name: 'Dansk',
    // permission: 364,
    alias: ['da-DK', 'da_DK'],
    codeTransferToServer: null,
    languageIcons: '🇩🇰',
    countryFlagIcons: Flags.DK
  },
  {
    fileName: 'nl-NL',
    cnName: '荷兰语',
    name: 'Vlaams',
    // permission: 364,
    alias: ['nl-NL', 'nl_NL'],
    codeTransferToServer: null,
    languageIcons: '🇳🇱',
    countryFlagIcons: Flags.NL
  },
  {
    fileName: 'fi-FI',
    cnName: '芬兰语',
    name: 'Suomi',
    // permission: 364,
    alias: ['fi-FI', 'fi_FI'],
    codeTransferToServer: null,
    languageIcons: '🇫🇮',
    countryFlagIcons: Flags.FI
  },
  {
    fileName: 'el-GR',
    cnName: '希腊语',
    name: 'Ελληνικά',
    // permission: 364,
    alias: ['el-GR', 'el_GR'],
    codeTransferToServer: null,
    languageIcons: '🇬🇷',
    countryFlagIcons: Flags.GR
  },
  {
    fileName: 'hu-HU',
    cnName: '匈牙利语',
    name: 'Magyar',
    // permission: 364,
    alias: ['hu-HU', 'hu_HU'],
    codeTransferToServer: null,
    languageIcons: '🇭🇺',
    countryFlagIcons: Flags.HU
  },
  {
    fileName: 'is-IS',
    cnName: '冰岛语',
    name: 'Íslenska',
    // permission: 364,
    alias: ['is-IS', 'is_IS'],
    codeTransferToServer: null,
    languageIcons: '🇮🇸',
    countryFlagIcons: Flags.IS
  },
  {
    fileName: 'ja-JP',
    cnName: '日语',
    name: '日本語',
    // permission: 364,
    alias: ['ja-JP', 'ja_JP'],
    codeTransferToServer: null,
    languageIcons: '🇯🇵',
    countryFlagIcons: Flags.JP
  },
  {
    fileName: 'ko-KR',
    cnName: '韩语',
    name: '한국어',
    // permission: 364,
    alias: ['ko-KR', 'ko_KR'],
    codeTransferToServer: null,
    languageIcons: '🇰🇷',
    countryFlagIcons: Flags.KR
  },
  {
    fileName: 'pt-PT',
    cnName: '葡萄牙语',
    name: 'Português',
    // permission: 364,
    alias: ['pt-PT', 'pt_PT'],
    codeTransferToServer: null,
    languageIcons: '🇵🇹',
    countryFlagIcons: Flags.PT
  },
  {
    fileName: 'sv-SE',
    cnName: '瑞典语',
    name: 'Svenska',
    // permission: 364,
    alias: ['sv-SE', 'sv_SE'],
    codeTransferToServer: null,
    languageIcons: '🇸🇪',
    countryFlagIcons: Flags.SE
  },
  {
    fileName: 'th-TH',
    cnName: '泰语',
    name: 'ไทย',
    // permission: 364,
    alias: ['th-TH', 'th_TH'],
    codeTransferToServer: null,
    languageIcons: '🇹🇭',
    countryFlagIcons: Flags.TH
  }
]

const filterLocaleKey = (key: string | null): string => {
  return key
    ? localeDict.find((item) => {
        return item['alias'].includes(key)
      })?.fileName ?? ''
    : ''
}

function loadLocale() {
  const locales = require.context('./', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  let messages: Record<string, any> = {}
  let result: Record<string, any> = {}
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = { ...messages[locale], ...locales(key) }
    }
  })
  Object.entries(messages).forEach(([key, value]) => {
    result[key] = {}
    result[key]['common'] = value
  })

  return result
}

export function getLanguage() {
  // from localStorage
  const lngFromStorage = filterLocaleKey(window.localStorage.getItem('mango-i18n-system-language'))
  if (lngFromStorage) return lngFromStorage

  // from navigator
  const lngFromNavigator = filterLocaleKey(navigator.language)
  if (lngFromNavigator) return lngFromNavigator

  // fallback
  return 'zh-CN'
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(
    {
      resources: loadLocale(),
      react: {
        useSuspense: true
      },
      debug: false,
      lng: getLanguage(),
      fallbackLng: 'zh-CN',
      ns: ['common'],
      defaultNS: 'common',
      keySeparator: false, // we do not use keys in form messages.welcome
      interpolation: {
        escapeValue: false // react already safes from xss
      }
    },
    (err, t) => {
      if (err) return console.error(err)
    }
  )

export default i18n
