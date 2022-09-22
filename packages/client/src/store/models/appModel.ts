import { createModel } from '@rematch/core'
import storage from 'redux-persist/lib/storage'
import { message } from 'antd'
import i18n, { getLanguage } from '@/locales/index'
import * as API from '@/services/system'
import type { RootModel } from '../index'

type Sider = {
  opened: boolean
  [key: string]: any
}

type AppModelState = {
  sider: Sider
  selectedLanguage: string
  systemTitle: string
}

const appModel = createModel<RootModel>()({
  name: 'appModel',
  state: {
    sider: {
      opened: false
    },
    selectedLanguage: getLanguage(),
    systemTitle: ''
  } as AppModelState,
  reducers: {
    toggleSiderOpened(state) {
      const opened = !state.sider.opened
      return { ...state, sider: { ...state.sider, opened: opened } }
    },
    updateLanguage(state, payload: string) {
      return {
        ...state,
        ...{
          language: payload
        }
      }
    },
    updateSystemTitle(state, payload: string) {
      return {
        ...state,
        ...{
          systemTitle: payload
        }
      }
    }
  },
  effects: (dispatch) => ({
    async changeLanguage(selectedLanguage) {
      try {
        const t = await i18n.changeLanguage(selectedLanguage)
        message.success(t('切换语言成功'))
        dispatch.appModel.updateLanguage(selectedLanguage)
        window.localStorage.setItem('mango-i18n-system-language', selectedLanguage)
      } catch (error) {
        console.log(error)
        message.error(i18n.t('切换语言失败') + `: ${error}`)
      }
    },
    async getSystemTitle() {
      const response = await API.getPublicSetting()
      if (response.success && response.data && response.data.setting) {
        const {
          setting: { systemTitle }
        } = response.data
        dispatch.appModel.updateSystemTitle(systemTitle)
        return Promise.resolve(true)
      } else {
        return Promise.reject(response.msg)
      }
    }
  })
})

export const appModelPersistConfig = {
  key: 'appModel',
  storage: storage
}

export default appModel
