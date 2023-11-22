import { createModel } from '@rematch/core'
import { storage } from '@mango-kit/utils'

import i18n from '@/locales'
import * as API from '@/services/user'

import type { RootModel } from '@/store'
import type {
  LoginParamsType,
  RegisterParamsType,
  UpdateMyUserInfoParamsType,
  UpdateMyPasswordParamsType,
} from '@/services/user'

type TokenPari = {
  accessToken: string
  refreshToken: string
}

type UserInfo = {
  role: string
  userAllowedAuthList: (string | number)[]
  userId: string
  username: string
  email: string
  account_status: string
  creator: string
  create_time: number
  update_time: number
  [key: string]: any
}

type UserModelState = {
  tokenPair: TokenPari
  userInfo: UserInfo
}

const userModel = createModel<RootModel>()({
  name: 'userModel',
  state: {
    tokenPair: storage.getItem('TOKEN', {
      accessToken: '',
      refreshToken: '',
    }),
    userInfo: {
      role: '', // 用户的角色，用于权限系统
      userAllowedAuthList: [], // 用户的具体权限列表，用于权限系统
      userId: '',
      username: '',
      email: '',
      account_status: '',
      creator: '',
      create_time: 0,
      update_time: 0,
    },
  } as UserModelState,

  reducers: {
    updateTokenPair(state, payload: TokenPari) {
      return {
        ...state,
        ...{
          tokenPair: payload,
        },
      }
    },
    updateUserInfo(state, payload: UserInfo) {
      return { ...state, ...{ userInfo: payload } }
    },
  },
  effects: (dispatch) => ({
    async login(
      payload: LoginParamsType,
      rootState,
    ): Promise<{ success: boolean; msg: string }> {
      const { code, data, msg } = await API.login(payload)
      if (code === 200) {
        const { accessToken, refreshToken } = data
        dispatch.userModel.updateTokenPair({
          accessToken,
          refreshToken,
        })
        storage.setItem('TOKEN', {
          accessToken,
          refreshToken,
        })

        return Promise.resolve({
          success: true,
          msg: i18n.t('登录成功'),
        })
      } else {
        return Promise.resolve({
          success: false,
          msg: msg || i18n.t('账户或者密码错误'),
        })
      }
    },
    async register(
      payload: RegisterParamsType,
      rootState,
    ): Promise<{ success: boolean; msg: string }> {
      const { code, data, msg } = await API.register(payload)
      if (code === 200) {
        const { accessToken, refreshToken } = data
        dispatch.userModel.updateTokenPair({
          accessToken,
          refreshToken,
        })
        storage.setItem('TOKEN', {
          accessToken,
          refreshToken,
        })

        return Promise.resolve({
          success: true,
          msg: i18n.t('登录成功'),
        })
      } else {
        return Promise.resolve({
          success: false,
          msg: msg || i18n.t('账户或者密码错误'),
        })
      }
    },
    async getUserInfo(): Promise<{ success: boolean; msg: string }> {
      const { code, data, msg } = await API.getUserInfo()
      if (code === 200) {
        const { user } = data
        await dispatch.userModel.updateUserInfo(user)
        return Promise.resolve({
          success: true,
          msg: i18n.t('获取用户信息成功'),
        })
      } else {
        return Promise.resolve({
          success: false,
          msg: msg || i18n.t('获取用户信息失败'),
        })
      }
    },
    async updateMyUserInfo(
      payload: UpdateMyUserInfoParamsType,
      rootState,
    ): Promise<{ success: boolean; msg: string }> {
      const { success, msg } = await API.updateMyUserInfo(payload)
      if (success) {
        return Promise.resolve({ success: true, msg: i18n.t('修改成功') })
      } else {
        return Promise.resolve({
          success: false,
          msg: msg || i18n.t('修改失败'),
        })
      }
    },
    async updateMyPassword(
      payload: UpdateMyPasswordParamsType,
      rootState,
    ): Promise<{ success: boolean; msg: string }> {
      const { success, msg } = await API.updateMyPassword(payload)
      if (success) {
        return Promise.resolve({ success: true, msg: i18n.t('修改密码成功') })
      } else {
        return Promise.resolve({
          success: false,
          msg: msg || i18n.t('修改密码失败'),
        })
      }
    },
    async logout(): Promise<{ success: boolean; msg: string }> {
      dispatch.userModel.updateTokenPair({
        accessToken: '',
        refreshToken: '',
      })
      storage.removeItem('TOKEN')
      return Promise.resolve({ success: true, msg: i18n.t('退出登录成功') })
    },
  }),
})

export default userModel
