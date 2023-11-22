import { lazy } from 'react'
import {
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  BarsOutlined,
  FileSearchOutlined,
  LaptopOutlined,
  TranslationOutlined,
  UserOutlined,
} from '@ant-design/icons'

import BasicLayout from '@/layouts/BasicLayout'
import UserLayout from '@/layouts/UserLayout'
import Home from '@/pages/home'
import Login from '@/pages/user/login'
import Register from '@/pages/user/register'

export type UserAllowedAuthList = (string | number)[]

export type UserRole = string

export type RouterItem = {
  auth: number | string | undefined
  role: string | string[] | undefined
  path: string
  name: string
  icon?: ReactNode
  hideInMenu?: boolean
  hideInBreadcrumb?: boolean
  component?: any
  showInParent?: boolean
  children?: RouterItem[]
  showBanner?: boolean
}

export const constantRouterConfig: RouterItem[] = [
  {
    auth: '',
    role: '',
    path: '/',
    name: '首页',
    hideInMenu: true,
    component: Home,
  },
  {
    auth: '',
    role: '',
    path: '/user',
    name: '用户',
    component: UserLayout,
    children: [
      {
        auth: '',
        role: '',
        path: 'login',
        name: '登录',
        component: Login,
      },
      {
        auth: '',
        role: '',
        path: 'register',
        name: '注册',
        component: Register,
      },
    ],
  },
]

export const asyncRouterConfig: RouterItem[] = [
  {
    auth: '',
    role: '',
    path: '/locale',
    name: '文案配置',
    icon: <TranslationOutlined />,
    component: BasicLayout,
    children: [
      {
        auth: '',
        role: '',
        path: '',
        name: '列表',
        hideInMenu: true,
        component: lazy(() => import('@/pages/locale')),
      },
    ],
  },
  {
    auth: '',
    role: '',
    path: '/record',
    name: '操作记录',
    icon: <BarsOutlined />,
    component: BasicLayout,
    children: [
      {
        auth: '',
        role: '',
        path: '',
        name: '列表',
        hideInMenu: true,
        component: lazy(() => import('@/pages/record')),
      },
    ],
  },
  {
    auth: '',
    role: ['admin'],
    icon: <SettingOutlined />,
    path: '/system',
    name: '系统配置',
    component: BasicLayout,
    children: [
      {
        auth: '',
        role: '',
        icon: <TeamOutlined />,
        path: 'user',
        name: '人员配置',
        component: lazy(() => import('@/pages/system/user')),
      },
      {
        auth: '',
        role: '',
        icon: <LaptopOutlined />,
        path: 'ui',
        name: '界面配置',
        component: lazy(() => import('@/pages/system/ui')),
      },
      {
        auth: '',
        role: '',
        icon: <FileSearchOutlined />,
        path: 'extract',
        name: '解析配置',
        component: lazy(() => import('@/pages/system/extract')),
      },
      {
        auth: '',
        role: '',
        icon: <ToolOutlined />,
        path: 'tool',
        name: '便捷工具',
        component: lazy(() => import('@/pages/system/tool')),
      },
    ],
  },
  {
    auth: '',
    role: '',
    path: '/account',
    name: '账户设置',
    icon: <UserOutlined />,
    component: BasicLayout,
    children: [
      {
        auth: '',
        role: '',
        path: '',
        name: '',
        hideInMenu: true,
        component: lazy(() => import('@/pages/account')),
      },
    ],
  },
]
