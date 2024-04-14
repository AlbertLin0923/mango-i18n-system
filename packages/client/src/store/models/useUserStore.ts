import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { storage } from '@mango-kit/utils'

import i18n from '@/locales'
import * as API from '@/services/user'

import type {
  LoginParamsType,
  RegisterParamsType,
  UpdateMyUserInfoParamsType,
  UpdateMyPasswordParamsType,
} from '@/services/user'
type TokenPair = {
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

type UserStore = {
  tokenPair: TokenPair
  userInfo: UserInfo
  login: (
    payload: LoginParamsType,
  ) => Promise<{ success: boolean; msg: string }>
  register: (
    payload: RegisterParamsType,
  ) => Promise<{ success: boolean; msg: string }>
  getUserInfo: () => Promise<{ success: boolean; msg: string }>
  updateMyUserInfo: (
    payload: UpdateMyUserInfoParamsType,
  ) => Promise<{ success: boolean; msg: string }>
  updateMyPassword: (
    payload: UpdateMyPasswordParamsType,
  ) => Promise<{ success: boolean; msg: string }>
  logout: () => { success: boolean; msg: string }
}

const useUserStore = create<UserStore>()(
  devtools((set, get) => ({
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
    login: async (payload) => {
      const { code, data, msg } = await API.login(payload)
      if (code === 200) {
        const { accessToken, refreshToken } = data
        set({ tokenPair: { accessToken, refreshToken } })
        storage.setItem('TOKEN', { accessToken, refreshToken })
        return { success: true, msg: i18n.t('登录成功') }
      } else {
        return { success: false, msg: msg || i18n.t('账户或者密码错误') }
      }
    },
    register: async (payload) => {
      const { code, data, msg } = await API.register(payload)
      if (code === 200) {
        const { accessToken, refreshToken } = data
        set({ tokenPair: { accessToken, refreshToken } })
        storage.setItem('TOKEN', { accessToken, refreshToken })
        return { success: true, msg: i18n.t('登录成功') }
      } else {
        return { success: false, msg: msg || i18n.t('账户或者密码错误') }
      }
    },
    getUserInfo: async () => {
      const { code, data, msg } = await API.getUserInfo()
      if (code === 200) {
        const { user } = data
        set({ userInfo: user })
        return { success: true, msg: i18n.t('获取用户信息成功') }
      } else {
        return { success: false, msg: msg || i18n.t('获取用户信息失败') }
      }
    },
    updateMyUserInfo: async (payload) => {
      const { code, msg } = await API.updateMyUserInfo(payload)
      if (code === 200) {
        return { success: true, msg: i18n.t('修改成功') }
      } else {
        return { success: false, msg: msg || i18n.t('修改失败') }
      }
    },
    updateMyPassword: async (payload) => {
      const { code, msg } = await API.updateMyPassword(payload)
      if (code === 200) {
        return { success: true, msg: i18n.t('修改密码成功') }
      } else {
        return { success: false, msg: msg || i18n.t('修改密码失败') }
      }
    },
    logout: () => {
      set({
        tokenPair: {
          accessToken: '',
          refreshToken: '',
        },
      })
      storage.removeItem('TOKEN')
      return { success: true, msg: i18n.t('退出登录成功') }
    },
  })),
)

export default useUserStore
