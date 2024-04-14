import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { storage } from '@mango-kit/utils'

import i18n, { getLanguage } from '@/locales'
import * as API from '@/services/system'

type AppStore = {
  publicSystemSetting: {
    systemTitle: string
    [key: string]: any
  }
  siderCollapsed: boolean
  language: string
  getPublicSetting: () => Promise<{ success: boolean; msg: string }>
  changeSiderCollapsed: (
    siderCollapsed: boolean,
  ) => Promise<{ success: boolean; msg: string }>
  changeLanguage: (
    language: string,
  ) => Promise<{ success: boolean; msg: string }>
}

const useAppStore = create<AppStore>()(
  devtools((set, get) => ({
    publicSystemSetting: {
      systemTitle: '',
    },
    siderCollapsed: storage.getItem('SIDER_COLLAPSED', true),
    language: getLanguage(),
    getPublicSetting: async () => {
      const {
        success,
        data: { setting },
        msg,
      } = await API.getPublicSetting()
      if (success && setting) {
        set({ publicSystemSetting: setting })
        return { success: true, msg }
      } else {
        return { success: false, msg }
      }
    },
    changeSiderCollapsed: async (siderCollapsed) => {
      set({ siderCollapsed })
      storage.setItem('SIDER_COLLAPSED', siderCollapsed)
      return { success: true, msg: i18n.t('切换菜单栏成功') }
    },
    changeLanguage: async (language) => {
      try {
        const t = await i18n.changeLanguage(language)
        set({ language })
        storage.setItem('LANGUAGE', language)
        return { success: true, msg: t('切换语言成功') }
      } catch (error) {
        return { success: false, msg: i18n.t('切换语言失败') }
      }
    },
  })),
)

export default useAppStore
