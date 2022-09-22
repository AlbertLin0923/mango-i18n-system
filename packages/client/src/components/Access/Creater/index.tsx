import routerConfig from '@/router/routerConfig'
import { AuthList, Role, RouterItem, RouterConfig, MenuItem, MenuConfig } from '@/type'

const hasPermission = (authList: AuthList, role: Role, route: RouterItem): boolean => {
  return (
    (!route.auth || authList.includes(Number(route.auth))) &&
    (!route.role || route.role.includes(role))
  )
}

export function filterAccessedRouterConfig(authList: AuthList, role: Role): RouterConfig {
  const loop = (_routerConfig: RouterConfig): RouterConfig => {
    const res: RouterConfig = []
    _routerConfig.forEach((route: RouterItem) => {
      if (hasPermission(authList, role, route)) {
        if (route.children) {
          route.children = loop(route.children)
        }
        res.push(route)
      }
    })

    return res
  }

  return loop(routerConfig)
}

function dig<T>(arr: Array<T>, parent: Array<T> = []): Array<T & { parent: Array<T> }> {
  return arr
    .map((item: any) => [
      { ...item, parent },
      ...(item?.children?.length ? dig(item?.children, [item, ...parent]) : [])
    ])
    .flat(Infinity)
}

export const matchMenuParent = (
  menuConfig: MenuConfig,
  currentPath: string,
  withCurrent = false
) => {
  const getPath = (arr: MenuConfig, path: string) => {
    var flattenArr = dig(arr)
    const cur = flattenArr.find((item) => item.path === path)
    if (cur) {
      return withCurrent ? [cur, ...cur.parent] : cur.parent
    } else {
      return []
    }
  }

  return getPath(menuConfig, currentPath)
}
