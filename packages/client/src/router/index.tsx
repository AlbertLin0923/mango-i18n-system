import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Modal } from 'antd'
import { cloneDeep, pick } from 'lodash'

import RequireLogin from '@/components/Access/RequireLogin'
import NotRequireLogin from '@/components/Access/NotRequireLogin'
import NoFoundPage from '@/pages/error-page/no-found-page'

import { constantRouterConfig, asyncRouterConfig } from './routerConfig'

import type { UserAllowedAuthList, UserRole, RouterItem } from './routerConfig'
import type { ReactNode } from 'react'

export const history = createBrowserHistory()
export { constantRouterConfig, asyncRouterConfig }

export type RouterConfigTreeItem = {
  key: string
  path: string
  label: string
  title: string
  icon?: ReactNode
  showBanner?: boolean
  children?: RouterConfigTreeItem[]
  [key: string]: any
}

const hasPermission = (
  userAllowedAuthList: UserAllowedAuthList,
  userRole: UserRole,
  route: RouterItem,
): boolean => {
  return (
    (!route.auth || userAllowedAuthList.includes(route.auth)) &&
    (!route.role || route.role.includes(userRole))
  )
}

function dig<T>(arr: T[], parent: T[] = []): (T & { parent: T[] })[] {
  return arr
    .map((item: any) => [
      { ...item, parent },
      ...(item?.children?.length ? dig(item?.children, [item, ...parent]) : []),
    ])
    .flat(Infinity)
}

export const createRouterConfigTree = (
  routerConfig: RouterItem[],
  filterKey?: string,
  additionalKeyList?: string[],
): RouterConfigTreeItem[] => {
  const loop = (
    _routerConfig: RouterItem[],
    parentPath = '',
  ): RouterConfigTreeItem[] => {
    if (!_routerConfig) {
      return []
    }

    return _routerConfig
      .filter((item) =>
        filterKey ? !item[filterKey as keyof typeof item] : true,
      )
      .map((item: RouterItem) => {
        const { path, name, icon, children } = item
        const isTopLevel = parentPath === ''
        const _path: string = isTopLevel ? `${path}` : `${parentPath}/${path}`

        const base = {
          key: _path,
          path: _path,
          label: name,
          title: name,
          icon: icon ?? null,
          children:
            children?.length &&
            children?.some((i) =>
              filterKey ? !i[filterKey as keyof typeof i] : true,
            )
              ? loop(children, _path)
              : undefined,
        }

        if (additionalKeyList?.length) {
          return { ...pick(item, additionalKeyList), ...base }
        } else {
          return base
        }
      })
  }
  return loop(routerConfig)
}

export const filterAccessedRoute = (
  userAllowedAuthList: UserAllowedAuthList,
  userRole: UserRole,
): RouterItem[] => {
  const loop = (_routerConfig: RouterItem[]): RouterItem[] => {
    const res: RouterItem[] = []
    _routerConfig.forEach((route: RouterItem) => {
      if (hasPermission(userAllowedAuthList, userRole, route)) {
        if (route.children) {
          route.children = loop(route.children)
        }
        res.push(route)
      }
    })
    return res
  }

  return loop(cloneDeep(asyncRouterConfig))
}

export const matchRoute = (routeKey: string, target: string) => {
  const tree = createRouterConfigTree(
    [...constantRouterConfig, ...asyncRouterConfig],
    '',
    ['showBanner'],
  )

  const loop = (_tree: RouterConfigTreeItem[]): RouterConfigTreeItem | null => {
    for (const i of _tree) {
      if (i[routeKey as keyof typeof i] === target) {
        return i
      } else {
        if (i?.children?.length) {
          const r: RouterConfigTreeItem | null = loop(i.children)
          if (r) return r
        }
      }
    }

    return null
  }

  return loop(tree)
}

export const createMenu = (routerConfig: RouterItem[]) => {
  return createRouterConfigTree(routerConfig, 'hideInMenu')
}

export const createBreadcrumb = () => {
  return createRouterConfigTree(
    [...constantRouterConfig, ...asyncRouterConfig],
    'hideInBreadcrumb',
  )
}

export const getFullRoutePath = (pathname: string, withCurrent = false) => {
  const tree = createRouterConfigTree([
    ...constantRouterConfig,
    ...asyncRouterConfig,
  ])
  const flattenArr = dig(tree)
  const cur = flattenArr.find((item) => item.path === pathname)
  if (cur) {
    return withCurrent
      ? [
          {
            path: cur?.path,
            label: cur?.label,
          },
          ...cur.parent,
        ]
      : cur.parent
  } else {
    return []
  }
}

const generateRouteFromConfig = (config: RouterItem[]): ReactNode[] => {
  const loop = (rc: RouterItem[]): ReactNode[] => {
    return rc.map((r: RouterItem) => {
      const { component: Component } = r
      return (
        <Route element={<Component />} key={r.path} path={r.path}>
          {r?.children?.length ? loop(r.children) : null}
        </Route>
      )
    })
  }
  return loop(config)
}

export const createRouter = (
  _constantRouterConfig: RouterItem[],
  _accessedRouteConfig: RouterItem[],
) => {
  const constantRoutes = generateRouteFromConfig(_constantRouterConfig)
  const asyncRoutes = generateRouteFromConfig(_accessedRouteConfig)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NotRequireLogin />}>{constantRoutes}</Route>
        <Route element={<RequireLogin />}>
          {asyncRoutes}
          <Route element={<NoFoundPage />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

// 路由切换,弹框清除
history.listen(() => {
  Modal.destroyAll()
})
