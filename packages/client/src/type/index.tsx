import * as React from 'react'
export type { Connect } from 'react-redux'

export type ValueOf<T> = T[keyof T]

export type AuthList = Array<string | number>

export type Role = string

export type LayoutName = 'BasicLayout'

export type RouterItem = {
  auth: number | string | undefined
  role: string | string[] | undefined
  icon: React.ReactNode
  path: string
  name: string
  showParentMenu?: boolean
  hideInMenu?: boolean
  component?: any
  redirect?: string
  children?: RouterItem[]
}

export type MenuItem = {
  key: string
  icon: React.ReactNode
  path: string
  label: string
  children?: MenuItem[]
}

export type MenuConfig = Array<MenuItem>

export type RouterConfig = Array<RouterItem>

export type ModalInstance = {
  _handleNoLoginInstance: any
  _handleLoginOverdueInstance: any
}

// --------------------------------------------------------------------------------

export type TokenPari = {
  accessToken: string
  refreshToken: string
}

export type UserInfo = {
  userId: string
  username: string
  role: string
  authList: AuthList
}

export type AccessedRouteConfig = Array<any>

export type UserModelState = {
  tokenPair: TokenPari
  userInfo: UserInfo
  accessedRouteConfig: AccessedRouteConfig
}
