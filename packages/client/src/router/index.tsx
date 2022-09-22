import { Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import RequireLogin from '@/components/Access/RequireLogin'
import RouterGuard from '@/components/Access/RouterGuard'

import Login from '@/pages/login/login'
import Register from '@/pages/register/register'

import NoFoundPage from '@/pages/errorPage/noFoundPage'

import { RouterConfig } from '@/type'

export const history = createBrowserHistory()

const createRoute = (accessedRouterConfig: RouterConfig): JSX.Element[] => {
  const loop = (_routerConfig: RouterConfig): JSX.Element[] => {
    return _routerConfig.map((_route) => {
      const Component = _route.component
      return (
        <Route key={_route.path} path={_route.path} element={<Component />}>
          {_route.children && _route.children.length > 0 ? loop(_route.children) : null}
        </Route>
      )
    })
  }

  return loop(accessedRouterConfig)
}

const router = (accessedRouterConfig: RouterConfig) => {
  const asyncRoute = createRoute(accessedRouterConfig)

  return (
    <HistoryRouter history={history}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <RequireLogin>
              <RouterGuard></RouterGuard>
            </RequireLogin>
          }
        >
          {accessedRouterConfig?.length > 0 ? (
            <>
              {asyncRoute}
              <Route path="*" element={<NoFoundPage />} />
            </>
          ) : (
            <Route path="*" element={<></>} />
          )}
        </Route>
      </Routes>
    </HistoryRouter>
  )
}

export default router
