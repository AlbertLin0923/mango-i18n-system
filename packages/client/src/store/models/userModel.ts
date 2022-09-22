import { createModel } from '@rematch/core'
import storage from 'redux-persist/lib/storage'

import { message } from 'antd'
import * as API from '@/services/user'
import { UpdateMyPasswordParamsType } from '@/services/user'
import store from '../index'
import i18n from '@/locales/index'
import { filterAccessedRouterConfig } from '@/components/Access/Creater'

import type { RootModel } from '../index'

import { TokenPari, UserInfo, AccessedRouteConfig, UserModelState } from '@/type/index'

const userModel = createModel<RootModel>()({
  name: 'userModel',
  state: {
    tokenPair: {
      accessToken: '',
      refreshToken: ''
    },
    userInfo: {
      userId: '',
      username: '',
      role: '',
      authList: []
    },
    accessedRouteConfig: []
  } as UserModelState,

  reducers: {
    updateTokenPair(state, payload: TokenPari) {
      return {
        ...state,
        ...{
          tokenPair: payload
        }
      }
    },
    updateUserInfo(state, payload: UserInfo) {
      return { ...state, ...{ userInfo: payload } }
    },
    updateAccessedRouteConfig(state, payload: AccessedRouteConfig) {
      return {
        ...state,
        ...{
          accessedRouteConfig: payload
        }
      }
    }
  },
  effects: (dispatch) => ({
    async login(payload: { username: string; password: string }, rootState): Promise<string> {
      const { username, password } = payload
      const response = await API.login({ username, password })
      if (response.success && response.data) {
        dispatch.userModel.updateTokenPair(response.data)
        return Promise.resolve(i18n.t('登录成功'))
      } else {
        return Promise.reject(response.msg || i18n.t('账户或者密码错误'))
      }
    },
    async register(
      payload: {
        username: string
        password: string
        email: string
        key: string
      },
      rootState
    ): Promise<string> {
      const response = await API.register(payload)
      if (response.success && response.data) {
        dispatch.userModel.updateTokenPair(response.data)
        return Promise.resolve(i18n.t('登录成功'))
      } else {
        return Promise.reject(response.msg || i18n.t('账户或者密码错误'))
      }
    },
    async refreshToken() {
      const { refreshToken } = store.getState().userModel.tokenPair
      const response = await API.refresh_token({ refreshToken })
      if (response.success && response.data) {
        const { accessToken } = response.data
        const tokenPair = {
          accessToken: accessToken,
          refreshToken: refreshToken
        }
        dispatch.userModel.updateTokenPair(tokenPair)
        return Promise.resolve(true)
      } else {
        return Promise.reject(i18n.t('更新accessToken失败'))
      }
    },
    async getUserInfo() {
      const response = await API.getUser()
      if (response.success && response?.data?.user) {
        const userInfo: UserInfo = response.data.user
        const { authList, role } = userInfo
        const accessedRouteConfig: AccessedRouteConfig = filterAccessedRouterConfig(authList, role)
        await dispatch.userModel.updateUserInfo(userInfo)
        await dispatch.userModel.updateAccessedRouteConfig(accessedRouteConfig)
        return Promise.resolve(i18n.t('获取用户信息成功'))
      } else {
        message.error(response.msg)
        return Promise.reject(response.msg)
      }
    },
    async logout() {
      dispatch.userModel.updateTokenPair({
        accessToken: '',
        refreshToken: ''
      })
    },
    async changePassword(payload: UpdateMyPasswordParamsType) {
      const response = await API.updateMyPassword(payload)
      if (response.success && response?.data?.user) {
        const userInfo: UserInfo = response.data.user
        dispatch.userModel.updateUserInfo(userInfo)
        dispatch.userModel.logout()
        return Promise.resolve(i18n.t('修改密码成功，请重新登录'))
      } else {
        message.error(response.msg)
        return Promise.reject(response.msg)
      }
    }
  })
})

export const userModelPersistConfig = {
  key: 'userModel',
  storage: storage
}

export default userModel
