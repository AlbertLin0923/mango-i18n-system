import { createModel } from '@rematch/core'
import { storage } from '@mango-kit/utils'

import i18n, { getLanguage } from '@/locales'
import * as API from '@/services/system'

import type { RootModel } from '@/store'

type AppModelState = {
  publicSystemSetting: {
    systemTitle: string
    [key: string]: any
  }
  siderCollapsed: boolean
  language: string
}

const appModel = createModel<RootModel>()({
  name: 'appModel',
  state: {
    publicSystemSetting: {
      systemTitle: '',
    },
    siderCollapsed: storage.getItem('SIDER_COLLAPSED', true),
    language: getLanguage(),
  } as AppModelState,

  reducers: {
    updatePublicSetting(state, payload: Record<string, any>) {
      return {
        ...state,
        ...{
          setting: payload,
        },
      }
    },
    updateSiderCollapsed(state, payload: boolean) {
      return {
        ...state,
        ...{
          siderCollapsed: payload,
        },
      }
    },
    updateLanguage(state, payload: string) {
      return {
        ...state,
        ...{
          language: payload,
        },
      }
    },
  },
  effects: (dispatch) => ({
    async getPublicSetting(): Promise<{ success: boolean; msg: string }> {
      const {
        success,
        data: { setting },
        msg,
      } = await API.getPublicSetting()
      if (success && setting) {
        dispatch.appModel.updatePublicSetting(setting)
        return Promise.resolve({ success: true, msg })
      } else {
        return Promise.reject({ success: false, msg })
      }
    },
    async changeSiderCollapsed(siderCollapsed: boolean): Promise<void> {
      dispatch.appModel.updateSiderCollapsed(siderCollapsed)
      storage.setItem('SIDER_COLLAPSED', siderCollapsed)
    },
    async changeLanguage(language): Promise<{ success: boolean; msg: string }> {
      try {
        const t = await i18n.changeLanguage(language)
        dispatch.appModel.updateLanguage(language)
        storage.setItem('LANGUAGE', language)
        return Promise.resolve({ success: true, msg: t('切换语言成功') })
      } catch (error) {
        return Promise.resolve({ success: false, msg: i18n.t('切换语言失败') })
      }
    },
  }),
})

export default appModel
