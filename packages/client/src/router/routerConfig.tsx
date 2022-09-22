import { lazy } from 'react'
import { DashboardOutlined, SettingOutlined } from '@ant-design/icons'
import { RouterConfig } from '@/type'

import BasicLayout from '@/layouts/BasicLayout'
import BlankLayout from '@/layouts/BlankLayout'

const routerConfig: RouterConfig = [
  {
    auth: '',
    role: '',
    icon: <DashboardOutlined />,
    path: '/',
    name: '首页',
    component: BasicLayout,
    children: [
      {
        auth: '',
        role: '',
        icon: <DashboardOutlined />,
        path: 'home',
        name: '首页',
        showParentMenu: true,
        component: lazy(() => import('@/pages/home'))
      }
    ]
  },
  {
    auth: '',
    role: '',
    icon: <DashboardOutlined />,
    path: '/locale',
    name: '语言包',
    component: BasicLayout,
    children: [
      {
        auth: '',
        role: '',
        icon: <DashboardOutlined />,
        path: 'list',
        name: '列表',
        component: lazy(() => import('@/pages/locale/index'))
      }
    ]
  },
  {
    auth: '',
    role: '',
    icon: <DashboardOutlined />,
    path: '/record',
    name: '操作记录',
    component: BasicLayout,
    children: [
      {
        auth: '',
        role: '',
        icon: <DashboardOutlined />,
        path: 'list',
        name: '列表',
        component: lazy(() => import('@/pages/record/index'))
      }
    ]
  },
  {
    auth: '',
    role: ['admin'],
    icon: <DashboardOutlined />,
    path: '/system',
    name: '系统管理',
    component: BasicLayout,
    children: [
      {
        auth: '',
        role: '',
        icon: <SettingOutlined />,
        path: 'user-setting',
        name: '人员配置',
        component: lazy(() => import('@/pages/system/user-setting/index'))
      },
      {
        auth: '',
        role: '',
        icon: <SettingOutlined />,
        path: 'system-setting',
        name: '界面配置',
        component: lazy(() => import('@/pages/system/system-setting/index'))
      },
      {
        auth: '',
        role: '',
        icon: <SettingOutlined />,
        path: 'extractor-setting',
        name: '解析配置',
        component: lazy(() => import('@/pages/system/extractor-setting/index'))
      },
      {
        auth: '',
        role: '',
        icon: <SettingOutlined />,
        path: 'system-tool',
        name: '便捷工具',
        component: lazy(() => import('@/pages/system/system-tool/index'))
      }
    ]
  }
]

export default routerConfig
